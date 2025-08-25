import FooterDashborad from "@/components/dashboard/Footer";
import Navbar from "@/components/dashboard/Navbar";
import { ReactNode } from "react";
import ProtectedProvider from "./Provider";

export const metadata = {
  title: "Dashboard | Som Popular",
};

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <ProtectedProvider>
      <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
        <Navbar />
        {children}
        <FooterDashborad />
      </div>
    </ProtectedProvider>
  );
}
