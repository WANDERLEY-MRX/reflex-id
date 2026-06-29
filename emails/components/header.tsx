import React from "react";

interface HeaderProps {
  previewText?: string;
}

export function Header({ previewText }: HeaderProps) {
  return (
    <div style={container}>
      {previewText && (
        <div style={previewStyle}>
          {previewText}
        </div>
      )}
      <table role="presentation" style={tableStyle}>
        <tr>
          <td align="center" style={tdStyle}>
            <img
              src="https://reflexid.com.br/logo.png"
              alt="Reflex ID"
              width="160"
              height="40"
              style={logoStyle}
            />
            <h1 style={titleStyle}>Reflex ID</h1>
          </td>
        </tr>
      </table>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: "32px 0 24px",
};

const previewStyle: React.CSSProperties & { msoHide?: string } = {
  fontSize: "0px",
  lineHeight: "0px",
  maxHeight: "0px",
  overflow: "hidden",
  display: "none",
  msoHide: "all",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
};

const tdStyle: React.CSSProperties = {
  textAlign: "center",
};

const logoStyle: React.CSSProperties = {
  display: "inline-block",
  border: 0,
  outline: "none",
};

const titleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: "20px",
  fontWeight: 700,
  color: "#7c3aed",
  letterSpacing: "-0.5px",
};
