interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordTemplate = ({
  name,
  resetUrl,
}: ResetPasswordEmailProps) => {
  return (
    <div>
      <h1>Redefinir a tua palavra-passe - Som Popular</h1>
      <div style={main}>
        <div style={container}>
          <div style={header}>
            <h1 style={h1}>🎵 Som Popular</h1>
          </div>

          <div style={content}>
            <h2 style={h2}>Olá, {name}!</h2>

            <p style={paragraph}>
              Recebemos um pedido para redefinir a tua palavra-passe.
            </p>

            <p style={paragraph}>
              Se foste tu que fizeste este pedido, clica no botão abaixo:
            </p>

            <div style={buttonContainer}>
              <a href={resetUrl} style={button}>
                🔑 Redefinir Palavra-passe
              </a>
            </div>

            <p style={smallText}>
              Se não conseguires clicar no botão, copia e cola este link no teu
              navegador:
            </p>

            <p style={urlText}>{resetUrl}</p>

            <hr style={divider} />

            <p style={smallText}>
              Se não pediste para redefinir a palavra-passe, podes ignorar este
              email. A tua palavra-passe permanecerá inalterada.
            </p>

            <p style={verySmallText}>
              Este link expira em 1 hora por motivos de segurança.
            </p>
          </div>

          <p style={footer}>
            © {new Date().getFullYear()} Som Popular. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordTemplate;

// Estilos
const main = {
  fontFamily: "Arial, sans-serif",
  lineHeight: "1.6",
  color: "#333",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px",
};

const header = {
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  padding: "30px",
  borderRadius: "10px 10px 0 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#2c3e50",
  marginBottom: "0",
  fontSize: "28px",
};

const content = {
  background: "white",
  padding: "30px",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const h2 = {
  color: "#34495e",
  marginBottom: "20px",
  fontSize: "24px",
};

const paragraph = {
  fontSize: "16px",
  marginBottom: "25px",
  color: "#333",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const button = {
  display: "inline-block",
  background: "#3498db",
  color: "white",
  padding: "15px 30px",
  textDecoration: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  fontSize: "16px",
};

const smallText = {
  fontSize: "14px",
  color: "#7f8c8d",
  marginBottom: "20px",
};

const urlText = {
  fontSize: "12px",
  color: "#95a5a6",
  wordBreak: "break-all" as const,
  background: "#f8f9fa",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "30px",
};

const divider = {
  border: "none",
  borderTop: "1px solid #ecf0f1",
  margin: "30px 0",
};

const verySmallText = {
  fontSize: "12px",
  color: "#95a5a6",
  marginTop: "30px",
};

const footer = {
  fontSize: "12px",
  color: "#7f8c8d",
  marginTop: "20px",
  textAlign: "center" as const,
};
