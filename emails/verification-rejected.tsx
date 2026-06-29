import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface VerificationRejectedProps {
  userName: string;
  evidenceTitle: string;
  reason: string;
  evidenceLink: string;
}

export function VerificationRejected({
  userName,
  evidenceTitle,
  reason,
  evidenceLink,
}: VerificationRejectedProps) {
  return (
    <Layout
      previewText="Sua evidência não foi aprovada na verificação do Reflex ID."
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <div style={badgeStyle}>✕</div>
        <h2 style={titleStyle}>Verificação não aprovada</h2>
        <p style={greetingStyle}>Olá, {userName}!</p>
        <p style={textStyle}>
          Infelizmente, sua evidência não foi aprovada no processo de
          verificação. Veja os detalhes abaixo para entender o motivo e como
          proceder.
        </p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Motivo da rejeição</h3>
          <p style={reasonStyle}>{reason}</p>
        </div>

        <div style={infoStyle}>
          <h4 style={infoTitleStyle}>💡 Como resolver</h4>
          <ul style={infoListStyle}>
            <li style={infoListItemStyle}>
            Revise a evidência e corrija o apontado acima
            </li>
            <li style={infoListItemStyle}>
              Certifique-se de que o arquivo é legível e completo
            </li>
            <li style={infoListItemStyle}>
              Envie uma nova versão da evidência
            </li>
          </ul>
        </div>

        <p style={textStyle}>
          Você pode editar a evidência e enviar novamente para verificação.
        </p>

        <Button href={evidenceLink} variant="secondary">
          Editar Evidência
        </Button>

        <p style={helpTextStyle}>
          Se você acredita que houve um erro, entre em contato com nosso
          suporte respondendo a este email.
        </p>
      </div>
    </Layout>
  );
}

const sectionStyle: React.CSSProperties = {
  padding: "8px 0",
};

const badgeStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "#ef4444",
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px",
  lineHeight: "48px",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#1e293b",
  margin: "0 0 16px",
  textAlign: "center",
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

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  border: "1px solid #fecaca",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#991b1b",
  margin: "0 0 8px",
};

const reasonStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#7f1d1d",
  lineHeight: "20px",
  margin: "0",
};

const infoStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  border: "1px solid #e2e8f0",
};

const infoTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#1e293b",
  margin: "0 0 8px",
};

const infoListStyle: React.CSSProperties = {
  margin: "0",
  paddingLeft: "16px",
};

const infoListItemStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#475569",
  lineHeight: "22px",
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "16px 0 0",
};
