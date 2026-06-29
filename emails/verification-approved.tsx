import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface VerificationApprovedProps {
  userName: string;
  evidenceTitle: string;
  confidenceLevel: string;
  evidenceLink: string;
}

export function VerificationApproved({
  userName,
  evidenceTitle,
  confidenceLevel,
  evidenceLink,
}: VerificationApprovedProps) {
  const levelLabel = {
    LOW: "Baixo",
    MEDIUM: "Médio",
    HIGH: "Alto",
    VERY_HIGH: "Muito Alto",
  }[confidenceLevel] || confidenceLevel;

  return (
    <Layout
      previewText="Sua evidência foi verificada com sucesso no Reflex ID!"
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <div style={badgeStyle}>✓</div>
        <h2 style={titleStyle}>Verificação aprovada!</h2>
        <p style={greetingStyle}>Olá, {userName}!</p>
        <p style={textStyle}>
          Sua evidência foi verificada com sucesso por nossa equipe. Sua
          identidade digital está mais forte!
        </p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Detalhes da verificação</h3>
          <table role="presentation" style={detailsTableStyle}>
            <tr>
              <td style={labelStyle}>Evidência:</td>
              <td style={valueStyle}>{evidenceTitle}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Nível de confiança:</td>
              <td style={valueStyle}>
                <span style={confidenceBadgeStyle(confidenceLevel)}>
                  {levelLabel}
                </span>
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Status:</td>
              <td style={valueStyle}>
                <span style={statusBadgeStyle}>Verificado</span>
              </td>
            </tr>
          </table>
        </div>

        <p style={textStyle}>
          Continue adicionando evidências ao seu perfil para aumentar seu
          nível de confiança e desbloquear novas oportunidades.
        </p>

        <Button href={evidenceLink}>Ver Evidência</Button>

        <p style={helpTextStyle}>
          Seu perfil agora tem mais credibilidade. Compartilhe com escolas e
          empresas!
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
  backgroundColor: "#22c55e",
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
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  border: "1px solid #bbf7d0",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#166534",
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

const confidenceBadgeStyle = (level: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 700,
  backgroundColor:
    level === "VERY_HIGH"
      ? "#7c3aed"
      : level === "HIGH"
        ? "#22c55e"
        : level === "MEDIUM"
          ? "#eab308"
          : "#94a3b8",
  color: "#ffffff",
});

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 700,
  backgroundColor: "#22c55e",
  color: "#ffffff",
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "16px 0 0",
};
