"use server";

import { db } from "@/lib/db";
import { auth, signIn } from "@/lib/auth-config";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/schemas";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";
import { config } from "@/config";
import { generateHash, generateRandomString } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function loginAction(data: LoginInput) {
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Dados inválidos" };
  }

  const { email, password } = validated.data;

  const rateCheck = await checkRateLimit(`login:${email}`);
  if (!rateCheck.success) {
    return { success: false, error: "Muitas tentativas. Tente novamente mais tarde." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email ou senha inválidos" };
        case "AccessDenied":
          return { success: false, error: "Email não verificado" };
        default:
          return { success: false, error: "Erro ao fazer login" };
      }
    }
    return { success: false, error: "Erro ao fazer login" };
  }
}

export async function registerAction(data: RegisterInput) {
  const validated = registerSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, email, password } = validated.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email já cadastrado" };
  }

  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
  const verificationToken = generateRandomString(32);

  const user = await db.user.create({
    data: {
      name,
      email,
      avatar: null,
      role: "USER",
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: email,
          access_token: passwordHash,
        },
      },
    },
  });

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + user.id.slice(0, 8);

  await db.profile.create({
    data: {
      userId: user.id,
      slug,
    },
  });

  await db.verificationToken.create({
    data: {
      identifier: email,
      token: verificationToken,
      expires: new Date(Date.now() + config.auth.verificationTokenExpiresIn * 1000),
    },
  });

  await sendVerificationEmail(email, verificationToken);

  await createAuditLog({
    userId: user.id,
    action: "USER_CREATED",
    resource: "user",
    resourceId: user.id,
  });

  return { success: true, message: "Conta criada! Verifique seu email." };
}

export async function forgotPasswordAction(data: ForgotPasswordInput) {
  const validated = forgotPasswordSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Email inválido" };
  }

  const { email } = validated.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true, message: "Se o email existir, você receberá um link de recuperação." };
  }

  const resetToken = generateRandomString(32);

  await db.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token: resetToken,
      expires: new Date(Date.now() + 3600000),
    },
  });

  await sendPasswordResetEmail(email, resetToken);

  return { success: true, message: "Email de recuperação enviado." };
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  const validated = resetPasswordSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { token, password } = validated.data;

  const storedToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!storedToken || storedToken.expires < new Date()) {
    return { success: false, error: "Token inválido ou expirado" };
  }

  const email = storedToken.identifier.replace("reset:", "");
  const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);

  await db.account.updateMany({
    where: {
      user: { email },
      provider: "credentials",
    },
    data: { access_token: passwordHash },
  });

  await db.verificationToken.delete({
    where: { identifier_token: { identifier: storedToken.identifier, token: storedToken.token } },
  });

  return { success: true, message: "Senha redefinida com sucesso!" };
}
