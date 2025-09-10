import Image from "next/image";
import Link from "next/link";

import { getSession } from "@/lib/auth-utils";

export default async function Footer() {
  const session = await getSession();

  const isLogged = !!session;

  const dashboardOption = isLogged
    ? {
        name: "Dashboard",
        href: "/dashboard",
      }
    : {
        name: "Login",
        href: "/auth/login",
      };

  const MENU = {
    participants: [
      {
        title: "Participantes",
        links: [
          {
            name: "Participar",
            href: "/participant-registration",
          },
          {
            name: "Ver Eventos",
            href: "/#events",
          },
          {
            name: "Consultar Inscrição",
            href: "/search-registration",
          },
          {
            name: "Ver Rankings",
            href: "/ranking",
          },
        ],
      },
    ],
    informations: [
      {
        title: "Festival",
        links: [
          {
            name: "Sobre o Festival",
            href: "/#about",
          },
          {
            name: "Eventos Atuais",
            href: "/#events",
          },
          {
            name: "Parceiros",
            href: "/#partners",
          },
        ],
      },
    ],
    utilities: [
      {
        title: "Suporte",
        links: [
          {
            name: "Ajuda",
            href: "/help",
          },
          { ...dashboardOption },
          // {
          //   name: "WhatsApp",
          //   href: "https://wa.me/5511999999999",
          // },
          // {
          //   name: "55 (43) ****-****",
          //   href: "tel:554399999-9999",
          // },
        ],
      },
    ],
  };

  return (
    <footer className="bg-terra text-neve text-white py-12 px-4">
      <div className="container mx-auto">
        {/* Logo e Título Principal */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/images/logo.png"
              alt="Festival Som Popular"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h3 className="festival-title text-xl">Som Popular</h3>
          </div>

          <p className="text-neve/80 text-lg mb-6">
            Celebrando a música e os talentos da nossa comunidade
          </p>
        </div>

        {/* Links de Navegação */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Participantes */}
          <div className="text-center md:text-left">
            {MENU.participants.map((section) => (
              <div key={section.title}>
                <h4 className="festival-subtitle text-neve font-semibold mb-4">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-neve/80 hover:text-dourado transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Informações */}
          <div className="text-center md:text-left">
            {MENU.informations.map((section) => (
              <div key={section.title}>
                <h4 className="festival-subtitle text-neve font-semibold mb-4">
                  {section.title}
                </h4>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-neve/80 hover:text-dourado transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="text-center md:text-left">
            {MENU.utilities.map((section) => (
              <div key={section.title}>
                <h4 className="festival-subtitle text-neve font-semibold mb-4">
                  {section.title}
                </h4>
                <div className="space-y-2 text-neve/80">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-neve/80 hover:text-dourado transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Organizadores */}
        <div className="py-4 space-y-2">
          <h4 className="festival-subtitle text-neve font-semibold text-center">
            Organização
          </h4>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-12">
            {/* Prefeitura de Centenário do Sul */}
            <div className="flex items-center text-center">
              <Image
                src="/images/pmcentenario.png"
                alt="Prefeitura de Centenário do Sul"
                width={180}
                height={50}
              />
            </div>

            {/* Secretaria da Cultura e Lazer */}
            <div className="flex items-center space-x-2 text-center">
              <Image
                src="/images/secretariacultura.png"
                alt="Secretaria da Cultura e Lazer"
                width={50}
                height={50}
              />
              <h5 className="text-neve font-medium text-sm mb-1">
                Secretaria de Esportes, Cultura e Lazer
              </h5>
            </div>
          </div>
        </div>

        {/* Separador e Copyright */}
        <div className="border-t border-neve/20 pt-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-neve/60">
              © 2025 Festival Som Popular. Todos os direitos reservados.
            </div>

            {/* Redes Sociais (placeholder) */}
            <div className="flex space-x-1 italic text-sm">
              <span>Desenvolvido por</span>
              <Link
                href="https://paulo.spiguel.one"
                target="_blank"
                className="text-neve/60 text-accent hover:text-dourado transition-colors"
              >
                Paulo Spiguel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
