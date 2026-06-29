import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface ResetPasswordProps {
  userName?: string;
  resetLink: string;
}

export function ResetPassword({ userName, resetLink }: ResetPasswordProps) {
  return (
    <Layout
      previewText="Redefina sua senha do Reflex ID."
      unsubscribeUrl="https://reflexid.com.br/auth/unsubscribe"
    >
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Redefinição de senha</h2>
        <p style={greetingStyle}>
          {userName ? `Olá, ${userName}!` : "Olá!"}
        </p>
        <p style={textStyle}>
          Recebemos uma solicitação de redefinição de senha para sua conta no
          Reflex ID. Clique no botão abaixo para criar uma nova senha.
        </p>

        <Button href={resetLink}>Redefinir Senha</Button>

        <div style={warningStyle}>
          <p style={warningTitleStyle}>⚠️ Não foi você?</p>
          <p style={warningTextStyle}>
            Se você não solicitou a redefinição de senha, ignore este email.
            Sua conta permanece segura.
          </p>
        </div>

        <div style={infoStyle}>
          <p style={infoTextStyle}>
            <strong>🔒 Link seguro:</strong> Este link é único e expira em 1
            hora por razões de segurança.
          </p>
        </div>

        <p style={helpTextStyle}>
          Se o botão acima não funcionar, copie e cole este link no seu
          navegador:
        </p>
        <p style={linkTextStyle}>{resetLink}</p>
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

const warningStyle: React.CSSProperties = {
  backgroundColor: "#fff7ed",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
  border: "1px solid #fed7aa",
};

const warningTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#9a3412",
  margin: "0 0 4px",
};

const warningTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#9a3412",
  margin: "0",
  lineHeight: "20px",
};

const infoStyle: React.CSSProperties = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
  border: "1px solid #bbf7d0",
};

const infoTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#166534",
  margin: "0",
  lineHeight: "20px",
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
