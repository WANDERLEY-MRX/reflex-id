import React from "react";

interface FooterProps {
  unsubscribeUrl?: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <div style={container}>
      <table role="presentation" style={tableStyle}>
        <tr>
          <td align="center" style={tdStyle}>
            <div style={linksStyle}>
              <a href="https://reflexid.com.br" style={linkStyle}>
                Site
              </a>
              <span style={separatorStyle}>•</span>
              <a href="https://reflexid.com.br/privacidade" style={linkStyle}>
                Privacidade
              </a>
              <span style={separatorStyle}>•</span>
              <a href="https://reflexid.com.br/termos" style={linkStyle}>
                Termos
              </a>
              <span style={separatorStyle}>•</span>
              <a href="https://reflexid.com.br/lgpd" style={linkStyle}>
                LGPD
              </a>
            </div>

            {unsubscribeUrl && (
              <div style={unsubStyle}>
                <a href={unsubscribeUrl} style={unsubLinkStyle}>
                  Cancelar inscrição
                </a>
              </div>
            )}

            <p style={addressStyle}>
              Reflex ID Tecnologia Ltda.
              <br />
              Ao responder, você aceita nossa{" "}
              <a href="https://reflexid.com.br/privacidade" style={inlineLinkStyle}>
                Política de Privacidade
              </a>{" "}
              e está sujeito à{" "}
              <a href="https://reflexid.com.br/lgpd" style={inlineLinkStyle}>
                LGPD
              </a>
              .
            </p>

            <p style={copyrightStyle}>
              &copy; {year} Reflex ID. Todos os direitos reservados.
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: "24px 0",
  borderTop: "1px solid #e2e8f0",
  marginTop: "32px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
};

const tdStyle: React.CSSProperties = {
  textAlign: "center",
};

const linksStyle: React.CSSProperties = {
  marginBottom: "12px",
};

const linkStyle: React.CSSProperties = {
  color: "#7c3aed",
  fontSize: "13px",
  textDecoration: "underline",
  margin: "0 4px",
};

const separatorStyle: React.CSSProperties = {
  color: "#94a3b8",
  margin: "0 6px",
};

const unsubStyle: React.CSSProperties = {
  marginBottom: "12px",
};

const unsubLinkStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  textDecoration: "underline",
};

const addressStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const inlineLinkStyle: React.CSSProperties = {
  color: "#7c3aed",
  textDecoration: "underline",
};

const copyrightStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "11px",
  margin: "0",
};
