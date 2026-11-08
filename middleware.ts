import { NextRequest, NextResponse } from "next/server";
import { verificarToken, COOKIE_NAME } from "@/lib/auth";

const LOGIN = "/";
const DESTINO_APOS_LOGIN = "/dashboard";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const valido = token ? await verificarToken(token) : null;

  const ehLogin = pathname === LOGIN;

  if (!valido && !ehLogin) {
    return NextResponse.redirect(new URL(LOGIN, req.url));
  }

  if (valido && ehLogin) {
    return NextResponse.redirect(new URL(DESTINO_APOS_LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};