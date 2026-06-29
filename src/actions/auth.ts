"use server";

export async function loginAction(_data: unknown) {
  return { success: false, error: "Use local auth provider" };
}

export async function registerAction(_data: unknown) {
  return { success: false, error: "Use local auth provider" };
}

export async function logoutAction() {
  return { success: true };
}

export async function forgotPasswordAction(_data: unknown) {
  return { success: true, message: "Email de recuperação enviado (simulado)" };
}

export async function resetPasswordAction(_data: unknown) {
  return { success: true, message: "Senha redefinida (simulada)" };
}
