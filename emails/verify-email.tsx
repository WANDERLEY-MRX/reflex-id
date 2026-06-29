import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface VerifyEmailProps {
  userName?: string;
  verificationLink: string;
  code?: string;
}

export function VerifyEmail({ userName, verificationLink, code }: VerifyEmailProps) {
  return (
    <Layout
      previewText="Verifique seu endereço de email no Reflex ID."
      unsubscribeUrl="https://reflexid.com.br/auth/unsubscribe"
    >
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Verifique seu email</h2>
        <p style={greetingStyle}>
          {userName ? `Olá, ${userName}!` : "Olá!"}
        </p>
        <p style={textStyle}>
          Obrigado por criar sua conta no Reflex ID. Para garantir a segurança
          da sua conta, precisamos verificar seu endereço de email.
        </p>

        <p style={textStyle}>
          Clique no botão abaixo para confirmar seu email:
        </p>

        <Button href={verificationLink}>Verificar Email</Button>

        {code && (
          <div style={codeBoxStyle}>
            <p style={codeLabelStyle}>Ou use o código de verificação:</p>
            <div style={codeStyle}>{code}</div>
          </div>
        )}

        <div style={warningStyle}>
          <p style={warningTextStyle}>
            Este link expira em 24 horas. Se você não criou uma conta no
            Reflex ID, ignore este email.
          </p>
        </div>

        <p style={helpTextStyle}>
          Se o botão acima não funcionar, copie e cole este link no seu
          navegador:
        </p>
        <p style={linkTextStyle}>{verificationLink}</p>
      </div>
    </Layout>
  );
}

const sectionStyle: React.CSSProperties = {
  padding: "8px 0",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#1e293b",
  margin: "0 0 16px",
};

const greetingStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#475569",
  margin: "0 0 12px",
};

const textStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#475569",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const codeBoxStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  border: "1px solid #e2e8f0",
  textAlign: "center",
};

const codeLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0 0 8px",
};

const codeStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 700,
  color: "#7c3aed",
  letterSpacing: "6px",
  fontFamily: "monospace",
};

const warningStyle: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "16px 0",
  border: "1px solid #fecaca",
};

const warningTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#991b1b",
  margin: "0",
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "16px 0 4px",
};

const linkTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#7c3aed",
  wordBreak: "break-all",
  margin: "0",
};
