"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { ROLES } from "@/constants";
import { useSession } from "@/lib/auth-client";

export default function ProtectedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  // Variáveis derivadas movidas para dentro do useEffect para evitar re-renders

  useEffect(() => {
    if (isPending) {
      return; // Ainda carregando
    }

    if (!session) {
      console.log("ProtectedProvider: Sem sessão, redirecionando para login");
      router.push("/auth/login");
      return;
    }

    const userRole = session?.user?.role || null;
    const currentPath = pathname;

    console.log("ProtectedProvider: ", { userRole, currentPath });

    // Verificar permissões baseadas na página atual
    if (currentPath.startsWith("/dashboard")) {
      // Dashboard: apenas admins
      if (userRole !== ROLES.ADMIN) {
        console.log("ProtectedProvider: Dashboard negado para não-admin");
        if (userRole === ROLES.OPERATOR) {
          router.push("/votings");
        } else {
          router.push("/auth/login");
        }
        return;
      }
    } else if (currentPath.startsWith("/votings")) {
      // Votações: admins e operadores
      if (userRole !== ROLES.ADMIN && userRole !== ROLES.OPERATOR) {
        console.log(
          "ProtectedProvider: Votações negadas para usuário sem permissão"
        );
        router.push("/auth/login");
        return;
      }
    }

    // Se chegou até aqui, a validação passou
    console.log("ProtectedProvider: Acesso permitido");
    setIsValidating(false);
  }, [session, isPending, pathname, router]);

  if (isPending || isValidating) {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  // Verificações finais baseadas na página usando valores diretos
  const userRole = session?.user?.role || null;
  const currentPath = pathname;

  if (currentPath.startsWith("/dashboard") && userRole !== ROLES.ADMIN) {
    return null;
  }

  if (
    currentPath.startsWith("/votings") &&
    userRole !== ROLES.ADMIN &&
    userRole !== ROLES.OPERATOR
  ) {
    return null;
  }

  // Se não é admin nem operador, bloquear acesso
  if (userRole !== ROLES.ADMIN && userRole !== ROLES.OPERATOR) {
    return null;
  }

  return <div>{children}</div>;
}
