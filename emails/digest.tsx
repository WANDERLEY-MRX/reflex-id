import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface DigestProps {
  userName: string;
  weekStart: string;
  weekEnd: string;
  stats: {
    newEvidences: number;
    verifiedEvidences: number;
    newValidations: number;
    newAchievements: number;
    profileViews: number;
    confidenceScore: number;
  };
  profileLink: string;
}

export function Digest({
  userName,
  weekStart,
  weekEnd,
  stats,
  profileLink,
}: DigestProps) {
  return (
    <Layout
      previewText="Seu relatório semanal de evolução do Reflex ID está pronto!"
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Relatório semanal</h2>
        <p style={greetingStyle}>Olá, {userName}!</p>
        <p style={textStyle}>
          Aqui está seu resumo de evolução no Reflex ID de{" "}
          <strong>{weekStart}</strong> a <strong>{weekEnd}</strong>.
        </p>

        <div style={gridStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.newEvidences}</div>
            <div style={statLabelStyle}>Novas evidências</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.verifiedEvidences}</div>
            <div style={statLabelStyle}>Verificadas</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.newValidations}</div>
            <div style={statLabelStyle}>Validações</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.newAchievements}</div>
            <div style={statLabelStyle}>Conquistas</div>
          </div>
        </div>

        <div style={extraStatsStyle}>
          <table role="presentation" style={detailsTableStyle}>
            <tr>
              <td style={labelStyle}>Visualizações do perfil</td>
              <td style={valueStyle}>{stats.profileViews}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Score de confiança</td>
              <td style={valueStyle}>
                <span style={scoreBadgeStyle}>{stats.confidenceScore}%</span>
              </td>
            </tr>
          </table>
        </div>

        <p style={textStyle}>
          Continue assim! Quanto mais evidências verificadas você tiver, maior
          será sua credibilidade na plataforma.
        </p>

        <Button href={profileLink}>Ver Perfil Completo</Button>
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

const gridStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  margin: "16px 0",
};

const statCardStyle: React.CSSProperties = {
  flex: "1 1 calc(50% - 8px)",
  minWidth: "120px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center",
  border: "1px solid #e2e8f0",
  boxSizing: "border-box",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 700,
  color: "#7c3aed",
  lineHeight: "32px",
  marginBottom: "4px",
};

const statLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const extraStatsStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
  border: "1px solid #e2e8f0",
};

const detailsTableStyle: React.CSSProperties = {
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
  padding: "4px 0",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#1e293b",
  padding: "4px 0",
  fontWeight: 700,
  textAlign: "right",
};

const scoreBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "13px",
  fontWeight: 700,
  backgroundColor: "#ede9fe",
  color: "#7c3aed",
};
