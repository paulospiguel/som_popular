interface SendAcceptTermsTemplateProps {
  name: string;
  termsAndConditionsUrl: string;
}

export const SendAcceptTermsTemplate = ({
  name,
  termsAndConditionsUrl,
}: SendAcceptTermsTemplateProps) => {
  return (
    <div style={styles.main}>
      <div style={styles.container}>
        {/* Header com logo e informações oficiais */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🎵</div>
            <div style={styles.brandInfo}>
              <h1 style={styles.brandTitle}>Som Popular</h1>
              <p style={styles.brandSubtitle}>Festival de Música Popular</p>
            </div>
          </div>
          <div style={styles.officialBadge}>
            <span style={styles.badgeText}>✓ Email Oficial</span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div style={styles.content}>
          <div style={styles.greeting}>
            <h2 style={styles.h2}>Olá, {name}!</h2>
            <p style={styles.introText}>
              Obrigado por se inscrever no <strong>Festival Som Popular</strong>
              ! Para finalizar sua participação, precisamos que você aceite
              nossos termos e condições.
            </p>
          </div>

          {/* Card de informações importantes */}
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>📋 Informações Importantes</h3>
            <ul style={styles.infoList}>
              <li style={styles.infoItem}>
                Este é um email oficial do Festival Som Popular
              </li>
              <li style={styles.infoItem}>
                Sua participação está condicionada à aceitação dos termos
              </li>
              <li style={styles.infoItem}>
                Seus dados estão protegidos conforme a LGPD
              </li>
              <li style={styles.infoItem}>
                Você pode cancelar sua inscrição a qualquer momento
              </li>
            </ul>
          </div>

          {/* Call to action */}
          <div style={styles.ctaContainer}>
            <p style={styles.ctaText}>
              Clique no botão abaixo para aceitar os termos e condições:
            </p>
            <a href={termsAndConditionsUrl} style={styles.button}>
              <span style={styles.buttonText}>
                ✓ Aceitar Termos e Condições
              </span>
            </a>
          </div>

          {/* Informações de segurança */}
          <div style={styles.securityInfo}>
            <p style={styles.securityText}>
              <strong>🔒 Segurança:</strong> Este email foi enviado de um
              servidor seguro. Se você não solicitou esta inscrição, ignore este
              email.
            </p>
            <p style={styles.contactText}>
              <strong>📞 Dúvidas?</strong> Entre em contato conosco através do
              nosso site oficial ou responda este email.
            </p>
          </div>
        </div>

        {/* Footer com informações oficiais */}
        <div style={styles.footer}>
          <div style={styles.footerContent}>
            <p style={styles.footerText}>
              <strong>Festival Som Popular</strong>
              <br />
              Secretaria de Cultura - Prefeitura Municipal
              <br />
              Email oficial: festival@sompopular.com.br
            </p>
            <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink}>
                Política de Privacidade
              </a>
              <span style={styles.separator}>|</span>
              <a href="#" style={styles.footerLink}>
                Termos de Uso
              </a>
              <span style={styles.separator}>|</span>
              <a href="#" style={styles.footerLink}>
                Contato
              </a>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>
              © 2024 Festival Som Popular. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  main: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333333",
    backgroundColor: "#f8f9fa",
    margin: "0",
    padding: "0",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "30px",
    color: "#ffffff",
    position: "relative" as const,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  logo: {
    fontSize: "32px",
    marginRight: "15px",
  },
  brandInfo: {
    flex: "1",
  },
  brandTitle: {
    color: "#ffffff",
    margin: "0",
    fontSize: "28px",
    fontWeight: "bold",
  },
  brandSubtitle: {
    color: "#e8e8e8",
    margin: "5px 0 0 0",
    fontSize: "14px",
  },
  officialBadge: {
    position: "absolute" as const,
    top: "15px",
    right: "15px",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "5px 12px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
  },
  content: {
    padding: "40px 30px",
  },
  greeting: {
    marginBottom: "30px",
  },
  h2: {
    color: "#2c3e50",
    marginBottom: "15px",
    fontSize: "24px",
    fontWeight: "600",
  },
  introText: {
    fontSize: "16px",
    marginBottom: "0",
    color: "#555555",
    lineHeight: "1.5",
  },
  infoCard: {
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
  },
  cardTitle: {
    color: "#495057",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600",
  },
  infoList: {
    margin: "0",
    paddingLeft: "20px",
  },
  infoItem: {
    fontSize: "14px",
    color: "#6c757d",
    marginBottom: "8px",
    lineHeight: "1.4",
  },
  ctaContainer: {
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  ctaText: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#555555",
  },
  button: {
    display: "inline-block",
    background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    color: "#ffffff",
    padding: "15px 35px",
    textDecoration: "none",
    borderRadius: "25px",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
    transition: "all 0.3s ease",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "16px",
  },
  securityInfo: {
    background: "#e3f2fd",
    border: "1px solid #bbdefb",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  securityText: {
    fontSize: "14px",
    color: "#1565c0",
    marginBottom: "10px",
    lineHeight: "1.4",
  },
  contactText: {
    fontSize: "14px",
    color: "#1565c0",
    margin: "0",
    lineHeight: "1.4",
  },
  footer: {
    background: "#2c3e50",
    color: "#ffffff",
    padding: "30px",
  },
  footerContent: {
    marginBottom: "20px",
  },
  footerText: {
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "15px",
    color: "#bdc3c7",
  },
  footerLinks: {
    textAlign: "center" as const,
  },
  footerLink: {
    color: "#3498db",
    textDecoration: "none",
    fontSize: "12px",
    margin: "0 5px",
  },
  separator: {
    color: "#7f8c8d",
    margin: "0 5px",
  },
  footerBottom: {
    borderTop: "1px solid #34495e",
    paddingTop: "15px",
    textAlign: "center" as const,
  },
  copyright: {
    fontSize: "12px",
    color: "#95a5a6",
    margin: "0",
  },
};
