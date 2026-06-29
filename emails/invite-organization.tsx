import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface InviteOrganizationProps {
  organizationName: string;
  inviterName: string;
  inviteLink: string;
  role: string;
}

export function InviteOrganization({
  organizationName,
  inviterName,
  inviteLink,
  role,
}: InviteOrganizationProps) {
  return (
    <Layout
      previewText={`Você foi convidado para ${organizationName} no Reflex ID.`}
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Convite para organização</h2>
        <p style={greetingStyle}>Olá!</p>
        <p style={textStyle}>
          <strong>{inviterName}</strong> convidou você para fazer parte da
          organização <strong>{organizationName}</strong> no Reflex ID.
        </p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Detalhes do convite</h3>
          <table role="presentation" style={detailsTableStyle}>
            <tr>
              <td style={labelStyle}>Organização:</td>
              <td style={valueStyle}>{organizationName}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Convidado por:</td>
              <td style={valueStyle}>{inviterName}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Função:</td>
              <td style={valueStyle}>
                <span style={roleBadgeStyle}>{role}</span>
              </td>
            </tr>
          </table>
        </div>

        <p style={textStyle}>
          Ao aceitar o convite, você poderá colaborar com a organização,
          gerenciar evidências institucionais e participar do ecossistema de
          verificação.
        </p>

        <Button href={inviteLink}>Aceitar Convite</Button>

        <div style={warningStyle}>
          <p style={warningTextStyle}>
            Se você não conhece {inviterName} ou não esperava este convite,
            ignore este email.
          </p>
        </div>
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

const roleBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 700,
  backgroundColor: "#ede9fe",
  color: "#7c3aed",
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
