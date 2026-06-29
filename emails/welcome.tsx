import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface WelcomeEmailProps {
  userName: string;
}

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <Layout previewText="Bem-vindo ao Reflex ID! Complete seu perfil e comece a construir sua identidade digital.">
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Bem-vindo ao Reflex ID!</h2>
        <p style={greetingStyle}>Olá, {userName}!</p>
        <p style={textStyle}>
          Sua conta foi criada com sucesso. O Reflex ID é a plataforma que
          permite construir e gerenciar sua identidade digital verificável,
          reunindo suas conquistas acadêmicas, profissionais e pessoais em um
          só lugar.
        </p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Próximos passos</h3>
          <ol style={listStyle}>
            <li style={listItemStyle}>
              Complete seu perfil com foto e biografia
            </li>
            <li style={listItemStyle}>
              Adicione suas habilidades e experiências
            </li>
            <li style={listItemStyle}>
              Envie evidências para verificação
            </li>
            <li style={listItemStyle}>Conecte-se com organizações</li>
          </ol>
        </div>

        <p style={textStyle}>
          Comece agora completando seu perfil e descobrindo como o Reflex ID
          pode impulsionar suas oportunidades.
        </p>

        <Button href="https://reflexid.com.br/profile/edit">
          Completar Perfil
        </Button>

        <p style={helpTextStyle}>
          Precisa de ajuda? Responda a este email ou entre em contato pelo
          nosso{" "}
          <a href="https://reflexid.com.br/suporte" style={linkStyle}>
            suporte
          </a>
          .
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

const listStyle: React.CSSProperties = {
  margin: "0",
  paddingLeft: "20px",
};

const listItemStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#475569",
  lineHeight: "24px",
  marginBottom: "4px",
};

const helpTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "16px 0 0",
};

const linkStyle: React.CSSProperties = {
  color: "#7c3aed",
  textDecoration: "underline",
};
