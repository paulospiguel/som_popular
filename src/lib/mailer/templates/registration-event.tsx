import { getBaseUri } from "@/lib/base-url";

export interface RegistrationEvent {
  id: string;
  eventName: string;
  eventId: string;
  participantName: string;
  status: string;
  registrationDate: Date | null;
  eventDate: Date;
  qrData: string;
}

interface RegistrationEventTemplateProps {
  registrations: RegistrationEvent[];
}

const RegistrationEventTemplate = ({
  registrations,
}: RegistrationEventTemplateProps) => {
  return (
    <div>
      <h1>Confirmação de Inscrição - Festival Som Popular</h1>
      <div style={main}>
        <div style={container}>
          {/* Header com Logo e Título */}
          <div style={header}>
            <div style={logoContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${getBaseUri()}/images/logo.png`}
                alt="Festival Som Popular"
                style={logo}
              />
              <div style={logoText}>
                <h1 style={h1}>Som Popular</h1>
                <p style={headerSubtitle}>Confirmação de Inscrição</p>
              </div>
            </div>
          </div>

          <div style={content}>
            {/* Mensagem de Boas-vindas */}
            <div style={welcomeSection}>
              <h2 style={welcomeTitle}>
                🎉 Parabéns! Sua inscrição foi confirmada
              </h2>
              <p style={welcomeText}>
                Olá! Recebemos sua inscrição no Festival Som Popular. Abaixo
                estão todos os detalhes da sua participação.
              </p>
            </div>

            {/* Cards de Inscrição */}
            {registrations.map((registration, index) => (
              <div key={registration.id} style={registrationCard}>
                <div style={cardHeader}>
                  <h3 style={eventTitle}>🎤 {registration.eventName}</h3>
                  <div style={statusBadge}>
                    <span style={statusText}>{registration.status}</span>
                  </div>
                </div>

                <div style={infoSections}>
                  {/* Dados do Participante */}
                  <div style={infoSection}>
                    <h4 style={sectionTitle}>👤 Dados do Participante</h4>
                    <div style={infoGrid}>
                      <div style={infoItem}>
                        <strong>Nome:</strong> {registration.participantName}
                      </div>
                      <div style={infoItem}>
                        <strong>Número de Inscrição:</strong>
                        <span style={registrationNumber}>
                          #{registration.id?.toUpperCase()}
                        </span>
                      </div>
                      <div style={infoItem}>
                        <strong>Data da Inscrição:</strong>
                        {registration.registrationDate
                          ? new Date(
                              registration.registrationDate
                            ).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Não informada"}
                      </div>
                    </div>
                  </div>

                  {/* Dados do Evento */}
                  <div style={infoSection}>
                    <h4 style={sectionTitle}>📅 Dados do Evento</h4>
                    <div style={infoGrid}>
                      <div style={infoItem}>
                        <strong>Data do Evento:</strong>
                        {new Date(registration.eventDate).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      <div style={infoItem}>
                        <strong>ID do Evento:</strong> {registration.eventId}
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  {registration.qrData && (
                    <div style={qrSection}>
                      <h4 style={sectionTitle}>📱 QR Code de Acesso</h4>
                      <div style={qrContainer}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${registration.qrData}`}
                          alt="QR Code de Acesso"
                          style={qrImage}
                        />
                        <p style={qrText}>
                          Apresente este QR Code no dia do evento para confirmar
                          sua presença
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {index < registrations.length - 1 && <hr style={divider} />}
              </div>
            ))}

            {/* Informações Importantes */}
            <div style={importantInfo}>
              <h3 style={importantTitle}>⚠️ Informações Importantes</h3>
              <ul style={infoList}>
                <li>Guarde este email como comprovante de inscrição</li>
                <li>Apresente o QR Code no dia do evento</li>
                <li>Chegue com pelo menos 30 minutos de antecedência</li>
                <li>Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div style={buttonContainer}>
              <a href={`${getBaseUri()}/ranking`} style={primaryButton}>
                📊 Acompanhar Rankings
              </a>
              {registrations.length > 0 && (
                <a
                  href={`${getBaseUri()}/events/${registrations[0].eventId}/registration/confirmation?registration=${registrations[0].id}`}
                  style={secondaryButton}
                >
                  🎫 Visualizar Credencial
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={footer}>
            <div style={footerContent}>
              <div style={footerLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${getBaseUri()}/images/logo.png`}
                  alt="Festival Som Popular"
                  style={footerLogoImage}
                />
                <span style={footerTitle}>Som Popular</span>
              </div>
              <p style={footerText}>
                Celebrando a música e os talentos da nossa comunidade
              </p>
              <p style={footerCopyright}>
                © {new Date().getFullYear()} Festival Som Popular. Todos os
                direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationEventTemplate;

// ========================================
// 🎨 ESTILOS COM TEMA DA APLICAÇÃO
// ========================================

const main = {
  fontFamily: "Inter, Arial, sans-serif",
  lineHeight: "1.6",
  color: "#424242", // cinza-chumbo
  backgroundColor: "#f8f9fa",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "0",
  backgroundColor: "white",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

// Header com Logo
const header = {
  background: "linear-gradient(135deg, #4e342e 0%, #4caf50 50%, #fbc02d 100%)", // terra -> verde-suave -> dourado-claro
  padding: "40px 30px",
  textAlign: "center" as const,
  color: "white",
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  marginBottom: "10px",
};

const logo = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "3px solid rgba(255, 255, 255, 0.2)",
};

const logoText = {
  textAlign: "left" as const,
};

const h1 = {
  color: "white",
  margin: "0",
  fontSize: "32px",
  fontWeight: "bold",
  fontFamily: "Rye, serif",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
};

const headerSubtitle = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "16px",
  margin: "0",
  fontFamily: "Roboto Slab, serif",
};

// Conteúdo Principal
const content = {
  padding: "40px 30px",
};

const welcomeSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
  padding: "20px",
  background: "linear-gradient(135deg, #fff8e1 0%, #e8f5e8 100%)", // bege-claro -> verde-muito-suave
  borderRadius: "12px",
  border: "1px solid #fbc02d",
};

const welcomeTitle = {
  color: "#4caf50", // verde-suave
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  fontFamily: "Rye, serif",
};

const welcomeText = {
  color: "#424242", // cinza-chumbo
  fontSize: "16px",
  margin: "0",
  lineHeight: "1.6",
};

// Cards de Inscrição
const registrationCard = {
  marginBottom: "30px",
  padding: "25px",
  border: "1px solid #e8f5e8", // verde-muito-suave
  borderRadius: "12px",
  backgroundColor: "#fafafa",
  boxShadow: "0 2px 8px rgba(76, 175, 80, 0.1)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap" as const,
  gap: "10px",
};

const eventTitle = {
  color: "#4e342e", // terra
  margin: "0",
  fontSize: "20px",
  fontWeight: "bold",
  fontFamily: "Roboto Slab, serif",
};

const statusBadge = {
  background: "#4caf50", // verde-suave
  color: "white",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const statusText = {
  margin: "0",
};

const infoSections = {
  display: "grid",
  gap: "20px",
};

const infoSection = {
  padding: "20px",
  background: "white",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
};

const sectionTitle = {
  color: "#4caf50", // verde-suave
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "15px",
  borderBottom: "2px solid #4caf50",
  paddingBottom: "8px",
  fontFamily: "Roboto Slab, serif",
};

const infoGrid = {
  display: "grid",
  gap: "12px",
};

const infoItem = {
  fontSize: "14px",
  color: "#424242", // cinza-chumbo
  lineHeight: "1.5",
  display: "flex",
  flexWrap: "wrap" as const,
  alignItems: "center",
  gap: "5px",
};

const registrationNumber = {
  background: "#fbc02d", // dourado-claro
  color: "#4e342e", // terra
  padding: "4px 10px",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "13px",
  letterSpacing: "0.5px",
};

// QR Code
const qrSection = {
  textAlign: "center" as const,
  marginTop: "20px",
};

const qrContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  border: "2px solid #4caf50", // verde-suave
  display: "inline-block",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
};

const qrImage = {
  maxWidth: "150px",
  height: "auto",
  marginBottom: "15px",
  borderRadius: "8px",
};

const qrText = {
  fontSize: "13px",
  color: "#666",
  margin: "0",
  fontStyle: "italic",
  maxWidth: "200px",
};

// Informações Importantes
const importantInfo = {
  background: "#fff8e1", // bege-claro
  padding: "25px",
  borderRadius: "12px",
  border: "2px solid #fbc02d", // dourado-claro
  marginBottom: "30px",
  boxShadow: "0 2px 8px rgba(251, 192, 45, 0.2)",
};

const importantTitle = {
  color: "#4e342e", // terra
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "15px",
  fontFamily: "Roboto Slab, serif",
};

const infoList = {
  margin: "0",
  paddingLeft: "20px",
  fontSize: "14px",
  color: "#424242", // cinza-chumbo
  lineHeight: "1.6",
};

// Botões
const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "30px",
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

const primaryButton = {
  display: "inline-block",
  background: "#4caf50", // verde-suave
  color: "white",
  padding: "15px 30px",
  textDecoration: "none",
  borderRadius: "25px",
  fontWeight: "bold",
  fontSize: "16px",
  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
  transition: "all 0.3s ease",
  border: "none",
  cursor: "pointer",
};

const secondaryButton = {
  display: "inline-block",
  background: "transparent",
  color: "#4caf50", // verde-suave
  padding: "15px 30px",
  textDecoration: "none",
  borderRadius: "25px",
  fontWeight: "bold",
  fontSize: "16px",
  border: "2px solid #4caf50",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

// Footer
const footer = {
  background: "#4e342e", // terra
  color: "white",
  padding: "30px",
  textAlign: "center" as const,
};

const footerContent = {
  maxWidth: "400px",
  margin: "0 auto",
};

const footerLogo = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "15px",
};

const footerLogoImage = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
};

const footerTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  fontFamily: "Rye, serif",
};

const footerText = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.8)",
  margin: "0 0 15px 0",
  lineHeight: "1.5",
};

const footerCopyright = {
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.6)",
  margin: "0",
};

const divider = {
  border: "none",
  borderTop: "1px solid #e8f5e8", // verde-muito-suave
  margin: "25px 0",
};
