import FooterDashborad from "@/components/dashboard/Footer";
import Navbar from "@/components/dashboard/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { ToastProvider } from "@/components/ui/toast";
import { ReactNode } from "react";
import ProtectedProvider from "./Provider";

export const metadata = {
  title: "Dashboard | Som Popular",
};

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <ProtectedProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
          <Navbar />
          {children}
          <FooterDashborad />
          <Toaster />
        </div>
      </ToastProvider>
    </ProtectedProvider>
  );
}
