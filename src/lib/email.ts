import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
  const resend = getResendClient();
  if (!resend) {
    console.log("[Email] (modo demo - não enviado)");
    console.log(`  Para: ${options.to}`);
    console.log(`  Assunto: ${options.subject}`);
    return { id: "demo-email-id", success: true };
  }
  
  return resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@reflexid.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

// Templates de email (versão simplificada)
export function welcomeEmail(name: string) {
  return {
    subject: "Bem-vindo ao Reflex ID!",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h1>Bem-vindo ao Reflex ID!</h1><p>Olá ${name}, sua conta foi criada com sucesso.</p><p>Comece a construir sua identidade digital agora mesmo.</p></div>`,
  };
}

export function verificationEmail(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;
  return {
    subject: "Verifique seu email",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h1>Verificação de Email</h1><p>Olá ${name}, clique no link abaixo para verificar seu email:</p><a href="${url}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">Verificar Email</a><p>Se não foi você, ignore este email.</p></div>`,
  };
}

export function resetPasswordEmail(name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  return {
    subject: "Redefinir senha",
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h1>Redefinir Senha</h1><p>Olá ${name}, clique no link abaixo para redefinir sua senha:</p><a href="${url}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">Redefinir Senha</a><p>Se não foi você, ignore este email.</p></div>`,
  };
}