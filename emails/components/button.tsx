import React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

const baseStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: 600,
  textDecoration: "none",
  textAlign: "center",
  lineHeight: "24px",
  margin: "16px 0",
};

const variants: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
  },
  secondary: {
    backgroundColor: "#f1f5f9",
    color: "#334155",
    border: "1px solid #cbd5e1",
  },
  danger: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
  },
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...baseStyle, ...variants[variant] }}
    >
      {children}
    </a>
  );
}
