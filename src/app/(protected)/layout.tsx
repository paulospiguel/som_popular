import FooterDashborad from "@/components/dashboard/Footer";
import Navbar from "@/components/dashboard/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard | Som Popular",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bege-claro via-verde-muito-suave to-dourado-muito-claro">
      <Navbar />
      {children}
      <FooterDashborad />
    </div>
  );
}
