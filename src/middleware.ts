// middleware.ts
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Decide se a rota é API privada (para responder 401 em JSON)
 * Ajuste os prefixos conforme o teu projeto.
 */
function isPrivateApiPath(pathname: string) {
  return pathname.startsWith("/api/private/");
}

/**
 * Evita loop: páginas públicas (login, assets, etc.)
 */
function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-in-otp") ||
    pathname.startsWith("/reset-password-otp") ||
    pathname.startsWith("/api/auth/") || // endpoints do Better Auth
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname === "/"
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Deixa passar o que for explicitamente público
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Verificação rápida: só presença do cookie de sessão
  const hasCookie = Boolean(getSessionCookie(req as unknown as Request));
  if (hasCookie) return NextResponse.next();

  // Não autenticado:
  if (isPrivateApiPath(pathname)) {
    // Para APIs privadas, responder 401 JSON (sem redirect)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Para páginas, redirecionar para login OTP e preservar redirectTo
  const url = req.nextUrl.clone();
  url.pathname = "/sign-in-otp";
  const current = pathname + (search ?? "");
  url.searchParams.set("redirectTo", current);
  return NextResponse.redirect(url);
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

    // APIs privadas
    "/api/private/:path*",
  ],
};
