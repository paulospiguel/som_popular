// middleware.ts
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Páginas públicas
function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/api/auth/") || // endpoints do Better Auth
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  );
}

// APIs privadas (responder 401 em JSON em vez de redirecionar)
function isPrivateApi(pathname: string) {
  return pathname.startsWith("/api/private/");
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // deixa passar o que é público
  if (isPublicPath(pathname)) return NextResponse.next();

  // check rápido: presença do cookie de sessão (sem tocar no DB)
  const hasCookie = Boolean(getSessionCookie(req as unknown as Request));
  if (hasCookie) return NextResponse.next();

  // não autenticado
  if (isPrivateApi(pathname)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // páginas protegidas → redirect para login, preservando redirectTo
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("redirectTo", pathname + (search ?? ""));
  return NextResponse.redirect(url);
}

// Middleware corre só nas rotas que queres proteger (melhor performance)
export const config = {
  matcher: [
    // páginas protegidas
    "/dashboard/:path*",
    "/votacoes/:path*",
    "/settings/:path*",
    "/events/:path*",
    "/profile/:path*",
    "/participants/:path*",

    // APIs privadas
    "/api/private/:path*",
    "/actions/:path*", // Proteger server actions
  ],
};
