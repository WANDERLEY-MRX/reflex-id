// Stub - Email for MVP (console.log fallback)

export async function sendEmail(options: { to: string; subject: string; html: string }) {
  console.log("[Email MVP] To:", options.to, "Subject:", options.subject);
  return { id: "mvp-email", success: true };
}

export function verificationEmail(name: string, token: string) {
  return { subject: "Verifique seu email", html: `<p>Olá ${name}, use o código: ${token}</p>` };
}

export function resetPasswordEmail(name: string, token: string) {
  return { subject: "Redefinir senha", html: `<p>Olá ${name}, use o código: ${token}</p>` };
}

export function welcomeEmail(name: string) {
  return { subject: "Bem-vindo!", html: `<p>Olá ${name}, bem-vindo ao Reflex ID!</p>` };
}

export async function sendVerificationEmail(email: string, token: string) {
  return sendEmail({ to: email, subject: "Verifique seu email", html: `<p>Use o código: ${token}</p>` });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  return sendEmail({ to: email, subject: "Redefinir senha", html: `<p>Use o código: ${token}</p>` });
}
