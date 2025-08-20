import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

/**
 * Decide se a rota é API privada (para responder 401 em JSON)
 */
function isPrivateApiPath(pathname: string) {
  return pathname.startsWith("/api/private/");
}

/**
 * Evita loop: páginas públicas (login, assets, etc.)
 */
function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/auth/") || // endpoints do Better Auth
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  );
}

/**
 * Helper para extrair informações do request para logs
 */
function getRequestInfo(request: NextRequest) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Deixa passar o que for explicitamente público
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Verificação rápida: só presença do cookie de sessão
  const hasCookie = Boolean(getSessionCookie(request as unknown as Request));

  if (hasCookie) {
    return NextResponse.next();
  }

  // Não autenticado - log da tentativa de acesso não autorizado
  const requestInfo = getRequestInfo(request);

  // Como não podemos fazer logs assíncronos no middleware,
  // vamos adicionar headers para que possam ser processados depois
  const response = isPrivateApiPath(pathname)
    ? NextResponse.json({ error: "unauthorized" }, { status: 401 })
    : (() => {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        const current = pathname + (search ?? "");
        url.searchParams.set("redirectTo", current);
        return NextResponse.redirect(url);
      })();

  // Adicionar headers para logging posterior
  response.headers.set("x-unauthorized-access", "true");
  response.headers.set("x-attempted-path", pathname);
  response.headers.set("x-client-ip", requestInfo.ipAddress);
  response.headers.set("x-user-agent", requestInfo.userAgent);

  return response;
}

/**
 * PROTEÇÃO: liste aqui o que deve exigir sessão.
 * O middleware só corre nestas rotas, reduzindo overhead.
 */
export const config = {
  matcher: [
    // páginas protegidas
    "/dashboard/:path*",
    "/settings/:path*",
    "/events/:path*",
    "/profile/:path*",

    // APIs privadas
    "/api/private/:path*",
  ],
};
