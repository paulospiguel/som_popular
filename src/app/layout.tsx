import type { Metadata } from "next";
import { Baloo_2, Inter, Roboto, Roboto_Slab, Rye } from "next/font/google";
import { Toaster } from "sonner";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const baloo2 = Baloo_2({
  subsets: ["latin"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festival Som Popular - Plataforma de Gestão",
  description:
    "Plataforma digital para organizar festivais de talentos e música popular",
  keywords: [
    "festival",
    "música",
    "talentos",
    "som popular",
    "gestão",
    "eventos",
  ],
  authors: [{ name: "Som Popular" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${inter.className} ${rye.className} ${baloo2.className} ${robotoSlab.className} ${roboto.className}`}
    >
      <body className="antialiased festival-text min-h-screen">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
