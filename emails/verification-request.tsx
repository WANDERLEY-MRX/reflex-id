import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface VerificationRequestProps {
  adminName: string;
  requesterName: string;
  evidenceTitle: string;
  evidenceLink: string;
}

export function VerificationRequest({
  adminName,
  requesterName,
  evidenceTitle,
  evidenceLink,
}: VerificationRequestProps) {
  return (
    <Layout
      previewText="Nova solicitação de verificação de evidência no Reflex ID."
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Nova solicitação de verificação</h2>
        <p style={greetingStyle}>Olá, {adminName}!</p>
        <p style={textStyle}>
          O usuário <strong>{requesterName}</strong> solicitou a verificação de
          uma evidência no Reflex ID.
        </p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Detalhes da evidência</h3>
          <table role="presentation" style={detailsTableStyle}>
            <tr>
              <td style={labelStyle}>Título:</td>
              <td style={valueStyle}>{evidenceTitle}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Solicitante:</td>
              <td style={valueStyle}>{requesterName}</td>
            </tr>
          </table>
        </div>

        <p style={textStyle}>
          Por favor, revise a evidência e aprove ou rejeite a solicitação.
        </p>

        <Button href={evidenceLink}>Revisar Evidência</Button>

        <p style={helpTextStyle}>
          Quanto antes a verificação for concluída, melhor para a experiência
          do usuário na plataforma.
        </p>
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

const cardStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  border: "1px solid #e2e8f0",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1e293b",
  margin: "0 0 12px",
};

const detailsTableStyle: React.CSSProperties = {
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
  padding: "4px 12px 4px 0",
  whiteSpace: "nowrap",
  verticalAlign: "top",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#1e293b",
  padding: "4px 0",
  fontWeight: 600,
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "16px 0 0",
};
