"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Mail,
  Music,
  Phone,
  Search,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";

const FAQ_CATEGORIES = [
  {
    id: "general",
    title: "Geral",
    icon: HelpCircle,
    questions: [
      {
        question: "O que é o Festival Som Popular?",
        answer:
          "O Festival Som Popular é um evento musical promovido pela Prefeitura Municipal do Centenário do Sul, que visa promover e valorizar a música popular brasileira, oferecendo oportunidades para artistas locais e regionais demonstrarem seus talentos.",
      },
      {
        question: "Quando acontece o festival?",
        answer:
          "O festival acontece anualmente, geralmente entre os meses de setembro e novembro. As datas específicas são divulgadas com antecedência no site oficial e redes sociais.",
      },
      {
        question: "Onde o festival acontece?",
        answer:
          "O festival acontece em diferentes locais da cidade de Centenário do Sul, incluindo praças públicas, auditórios e espaços culturais. Cada evento tem sua localização específica divulgada.",
      },
      {
        question: "O festival é gratuito?",
        answer:
          "Sim! A participação no festival é totalmente gratuita, tanto para participantes quanto para o público. Não há cobrança de taxas de inscrição ou entrada.",
      },
    ],
  },
  {
    id: "participation",
    title: "Participação",
    icon: User,
    questions: [
      {
        question: "Quem pode participar do festival?",
        answer:
          "Podem participar artistas maiores de 16 anos, nas categorias: Vocal, Instrumental, Composição e Grupo/Banda. Não há restrições de gênero ou localização.",
      },
      {
        question: "Como me registro como participante?",
        answer:
          "Para se registrar, acesse a página 'Ser Participante' no menu principal. Preencha o formulário com seus dados pessoais e artísticos, aceite os termos e regulamento, e clique em 'Registrar como Participante'.",
      },
      {
        question: "Preciso de experiência musical para participar?",
        answer:
          "Não! O festival é aberto a todos os níveis de experiência, desde iniciantes até profissionais. Cada categoria tem critérios específicos de avaliação que consideram o nível do participante.",
      },
      {
        question: "Posso participar em mais de uma categoria?",
        answer:
          "Sim, você pode se inscrever em múltiplas categorias, desde que cumpra os requisitos de cada uma. Cada inscrição é independente e pode ter critérios específicos.",
      },
      {
        question: "E se eu tiver necessidades especiais?",
        answer:
          "O festival é totalmente inclusivo! Durante o registro, você pode indicar suas necessidades especiais e descrever as adaptações necessárias. Nossa equipe fará o possível para garantir sua participação.",
      },
    ],
  },
  {
    id: "registration",
    title: "Inscrições em Eventos",
    icon: Calendar,
    questions: [
      {
        question: "Como me inscrevo em um evento específico?",
        answer:
          "Após se registrar como participante, navegue até a seção de eventos, escolha o evento desejado e clique em 'Inscrever-me'. Preencha as informações específicas do evento e confirme sua inscrição.",
      },
      {
        question: "Posso cancelar uma inscrição?",
        answer:
          "Sim, mas é necessário entrar em contato conosco pelo menos 24 horas antes do evento. Entre em contato através do email ou telefone disponíveis na página de contato.",
      },
      {
        question: "Como sei se minha inscrição foi confirmada?",
        answer:
          "Após a inscrição, você receberá uma confirmação por email com todos os detalhes do evento e um QR code que serve como credencial. Você também pode consultar suas inscrições na página 'Consultar Inscrição'.",
      },
      {
        question: "E se o evento estiver lotado?",
        answer:
          "Cada evento tem um limite máximo de participantes. Se estiver lotado, você será colocado em uma lista de espera e será notificado caso haja desistências.",
      },
      {
        question: "Preciso levar documentos no dia do evento?",
        answer:
          "Sim, leve um documento de identificação com foto e o QR code da inscrição (pode ser impresso ou no celular). Esses documentos são necessários para sua identificação e participação.",
      },
    ],
  },
  {
    id: "evaluation",
    title: "Avaliação e Rankings",
    icon: Star,
    questions: [
      {
        question: "Como funciona a avaliação?",
        answer:
          "A avaliação é realizada por uma comissão julgadora composta por profissionais da área musical. Eles consideram critérios técnicos e artísticos específicos de cada categoria.",
      },
      {
        question: "Quais são os critérios de avaliação?",
        answer:
          "Os critérios variam por categoria, mas geralmente incluem: técnica musical, interpretação, criatividade, apresentação e adequação ao tema do festival. Os critérios específicos são divulgados antes de cada evento.",
      },
      {
        question: "Como posso ver meu ranking?",
        answer:
          "Os rankings são atualizados após cada fase do festival e podem ser consultados na seção 'Classificação' do site. Você pode ver tanto o ranking geral quanto o específico de cada evento.",
      },
      {
        question: "Quais são as fases do festival?",
        answer:
          "O festival é realizado em três fases: Classificatórias, Semi-finais e Final. Cada fase tem critérios específicos e os melhores classificados avançam para a próxima fase.",
      },
      {
        question: "Há prêmios para os vencedores?",
        answer:
          "Sim! Serão premiados os três primeiros colocados de cada categoria, além de prêmios especiais para melhor interpretação, melhor composição e escolha do público.",
      },
    ],
  },
  {
    id: "technical",
    title: "Aspectos Técnicos",
    icon: Music,
    questions: [
      {
        question: "Preciso levar meus próprios instrumentos?",
        answer:
          "Sim, para as categorias Instrumental e Grupo/Banda, você deve levar seus próprios instrumentos. Para Vocal, o festival fornece equipamentos de áudio básicos.",
      },
      {
        question: "Há ensaios antes dos eventos?",
        answer:
          "Geralmente não há ensaios formais, mas você terá um tempo de teste de som antes da sua apresentação para ajustar volumes e afinações.",
      },
      {
        question: "Qual o tempo máximo de apresentação?",
        answer:
          "O tempo varia por categoria e fase do festival. Na fase classificatória são 5 minutos, semi-finais 8 minutos e final 10 minutos. Os tempos exatos são divulgados antes de cada evento.",
      },
      {
        question: "Posso usar backing tracks ou playbacks?",
        answer:
          "Sim, você pode usar backing tracks, mas elas devem ser enviadas com antecedência e estar em formato MP3 ou WAV. É recomendado também levar um backup em pen drive.",
      },
      {
        question: "Há restrições de repertório?",
        answer:
          "O repertório deve ser de música popular brasileira. Músicas de outros gêneros ou idiomas não são permitidas. O repertório deve ser adequado para todas as idades.",
      },
    ],
  },
  {
    id: "support",
    title: "Suporte e Contato",
    icon: Mail,
    questions: [
      {
        question: "Como entro em contato com a organização?",
        answer:
          "Você pode nos contatar através do email cultura@centenariodosul.com.br ou pelo telefone (XX) XXXX-XXXX. Nossa equipe está disponível para esclarecer dúvidas e prestar suporte.",
      },
      {
        question: "Há horário de atendimento?",
        answer:
          "Sim, nosso atendimento funciona de segunda a sexta-feira, das 8h às 17h. Em horários de eventos, o atendimento é estendido conforme necessário.",
      },
      {
        question: "Posso agendar uma reunião para tirar dúvidas?",
        answer:
          "Sim! Para dúvidas mais complexas ou reuniões, entre em contato conosco e agendaremos um horário que seja conveniente para você.",
      },
      {
        question: "Há material de apoio disponível?",
        answer:
          "Sim! No site você encontra o regulamento completo, tutoriais de inscrição, e uma seção de perguntas frequentes. Também enviamos informações por email após o registro.",
      },
      {
        question: "Como posso reportar um problema?",
        answer:
          "Para reportar problemas técnicos, use o email de contato ou entre em contato durante os eventos. Nossa equipe está preparada para resolver questões rapidamente.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-verde-suave hover:text-verde-escuro mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Home
        </Link>

        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-verde-suave mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-cinza-chumbo mb-4">
            Central de Ajuda
          </h1>
          <p className="text-cinza-chumbo/70 max-w-2xl mx-auto">
            Encontre respostas para as principais dúvidas sobre o Festival Som
            Popular. Se não encontrar o que procura, entre em contato conosco!
          </p>
        </div>

        {/* Busca Rápida */}
        <div className="festival-card p-6 max-w-2xl mx-auto mb-12">
          <div className="text-center">
            <Search className="w-8 h-8 text-verde-suave mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-cinza-chumbo mb-2">
              Busca Rápida
            </h3>
            <p className="text-cinza-chumbo/70 mb-4">
              Digite palavras-chave para encontrar respostas rapidamente
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: inscrição, avaliação, instrumentos..."
                className="w-full p-3 border border-cinza-chumbo/20 rounded-lg pr-10"
              />
              <Search className="w-5 h-5 text-cinza-chumbo/50 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* FAQ por Categorias */}
        <div className="space-y-8">
          {FAQ_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="festival-card p-6">
                <div className="flex items-center mb-6">
                  <IconComponent className="w-6 h-6 text-verde-suave mr-3" />
                  <h2 className="text-2xl font-bold text-cinza-chumbo">
                    {category.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => {
                    return (
                      <AccordionItem
                        key={index}
                        value={faq.question}
                        className="border-b border-cinza-chumbo/20"
                      >
                        <AccordionTrigger className="text-left hover:text-verde-suave transition-colors py-4">
                          <span className="font-medium text-cinza-chumbo">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <p className="text-cinza-chumbo/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Contato Direto */}
        <div className="festival-card p-8 max-w-4xl mx-auto mt-12">
          <div className="text-center mb-8">
            <Mail className="w-16 h-16 text-verde-suave mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-cinza-chumbo mb-2">
              Ainda tem dúvidas?
            </h2>
            <p className="text-cinza-chumbo/70">
              Nossa equipe está pronta para ajudar! Entre em contato conosco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <Mail className="w-8 h-8 text-verde-suave mx-auto mb-3" />
              <h3 className="font-semibold text-cinza-chumbo mb-2">Email</h3>
              <p className="text-cinza-chumbo/70 mb-3">
                cultura@centenariodosul.com.br
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href =
                    "mailto:cultura@centenariodosul.com.br";
                }}
              >
                Enviar Email
              </Button>
            </div>

            <div className="text-center">
              <Phone className="w-8 h-8 text-dourado-claro mx-auto mb-3" />
              <h3 className="font-semibold text-cinza-chumbo mb-2">Telefone</h3>
              <p className="text-cinza-chumbo/70 mb-3">(XX) XXXX-XXXX</p>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "tel:XXXXXXXXXXX";
                }}
              >
                Ligar Agora
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-cinza-chumbo/20">
            <p className="text-cinza-chumbo/70 mb-4">
              Horário de atendimento: Segunda a Sexta, das 8h às 17h
            </p>
            <Link href="/">
              <Button className="festival-button">
                <Home className="w-4 h-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="festival-card p-6 max-w-4xl mx-auto mt-8">
          <h3 className="text-lg font-semibold text-cinza-chumbo mb-4 text-center">
            Links Úteis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/participant-registration">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Registrar como Participante
              </Button>
            </Link>
            <Link href="/regulation">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Ver Regulamento
              </Button>
            </Link>
            <Link href="/registration-lookup">
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Consultar Inscrições
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
