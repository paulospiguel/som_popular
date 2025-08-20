import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordTemplate = ({
  name,
  resetUrl,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Redefinir a tua palavra-passe - Som Popular</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🎵 Som Popular</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Olá, {name}!</Heading>

            <Text style={paragraph}>
              Recebemos um pedido para redefinir a tua palavra-passe.
            </Text>

            <Text style={paragraph}>
              Se foste tu que fizeste este pedido, clica no botão abaixo:
            </Text>

            <Section style={buttonContainer}>
              <Link href={resetUrl} style={button}>
                🔑 Redefinir Palavra-passe
              </Link>
            </Section>

            <Text style={smallText}>
              Se não conseguires clicar no botão, copia e cola este link no teu
              navegador:
            </Text>

            <Text style={urlText}>{resetUrl}</Text>

            <hr style={divider} />

            <Text style={smallText}>
              Se não pediste para redefinir a palavra-passe, podes ignorar este
              email. A tua palavra-passe permanecerá inalterada.
            </Text>

            <Text style={verySmallText}>
              Este link expira em 1 hora por motivos de segurança.
            </Text>
          </Section>

          <Text style={footer}>
            © {new Date().getFullYear()} Som Popular. Todos os direitos
            reservados.
          </Text>
        </Container>
      </Body>
    </Html>
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
