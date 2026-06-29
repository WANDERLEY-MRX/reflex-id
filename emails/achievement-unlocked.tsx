import React from "react";
import { Layout } from "./components/layout";
import { Button } from "./components/button";

interface AchievementUnlockedProps {
  userName: string;
  achievementTitle: string;
  achievementDescription: string;
  achievementIcon?: string;
  profileLink: string;
}

export function AchievementUnlocked({
  userName,
  achievementTitle,
  achievementDescription,
  achievementIcon,
  profileLink,
}: AchievementUnlockedProps) {
  return (
    <Layout
      previewText={`Parabéns! Você desbloqueou "${achievementTitle}" no Reflex ID.`}
      unsubscribeUrl="https://reflexid.com.br/notifications/unsubscribe"
    >
      <div style={sectionStyle}>
        <div style={badgeContainerStyle}>
          <div style={badgeStyle}>
            {achievementIcon || "🏆"}
          </div>
        </div>

        <h2 style={titleStyle}>Nova conquista desbloqueada!</h2>
        <p style={greetingStyle}>Parabéns, {userName}!</p>

        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>{achievementTitle}</h3>
          <p style={descriptionStyle}>{achievementDescription}</p>
        </div>

        <p style={textStyle}>
          Você acaba de desbloquear uma nova conquista no Reflex ID. Continue
          construindo sua identidade digital para desbloquear ainda mais
          conquistas e badges exclusivos.
        </p>

        <Button href={profileLink}>Ver Conquistas</Button>

        <p style={shareTextStyle}>
          Compartilhe essa conquista com seus amigos e rede de contatos!
        </p>
      </div>
    </Layout>
  );
}

const sectionStyle: React.CSSProperties = {
  padding: "8px 0",
  textAlign: "center",
};

const badgeContainerStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const badgeStyle: React.CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  backgroundColor: "#fef3c7",
  border: "3px solid #f59e0b",
  fontSize: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  lineHeight: "64px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  color: "#1e293b",
  margin: "0 0 12px",
};

const greetingStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#475569",
  margin: "0 0 16px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fffbeb",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
  border: "1px solid #fde68a",
  textAlign: "left",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#92400e",
  margin: "0 0 8px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#78350f",
  lineHeight: "20px",
  margin: "0",
};

const textStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#475569",
  lineHeight: "24px",
  margin: "0 0 16px",
  textAlign: "left",
};

const shareTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#94a3b8",
  margin: "16px 0 0",
};
