import { requireMaster } from "@/lib/action-guards";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMaster();
  return <>{children}</>;
}

