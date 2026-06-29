import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface LayoutProps {
  children: React.ReactNode;
  previewText?: string;
  unsubscribeUrl?: string;
}

export function Layout({ children, previewText, unsubscribeUrl }: LayoutProps) {
  return (
    <div style={outerStyle}>
      <table role="presentation" style={bodyTableStyle}>
        <tr>
          <td align="center" style={bodyTdStyle}>
            <table role="presentation" style={containerStyle}>
              <tr>
                <td style={contentTdStyle}>
                  <Header previewText={previewText} />
                  <div style={contentStyle}>{children}</div>
                  <Footer unsubscribeUrl={unsubscribeUrl} />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );
}

const outerStyle: React.CSSProperties = {
  backgroundColor: "#f1f5f9",
  padding: "24px 0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const bodyTableStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#f1f5f9",
};

const bodyTdStyle: React.CSSProperties = {
  padding: "0",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  borderCollapse: "separate",
};

const contentTdStyle: React.CSSProperties = {
  padding: "0 32px",
};

const contentStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "24px",
};
