import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log({session}); //?: INFORMACION UTIL DEL USUARIO
  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `page=${requestedPage}`;
    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const validRoles = ['admin', 'super-user', 'CEO'];

    if (!validRoles.includes(session.user.role)) {
      // Opcion de Fernando:
      // const url = req.nextUrl.clone();
      // url.pathname = '/';
      // return NextResponse.redirect(url);

      // Opcion de documentacion:
      return NextResponse.rewrite(new URL('/404', req.url)); // Esta te permite mostrar otra pagina pero con el path solicitado (muestra la pagina 404 pero con el path de /admin). Quiero aquí que muestre la página 403 Forbiden pero no la he creado.

      // Otra opcion para redirigir al home:
      // return NextResponse.redirect(new URL('/', req.url)); // Esta redirige y reemplaza el path
    }
  }

  // return NextResponse.redirect(`/auth/login?page=${requestedPage}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/address', '/checkout/summary', '/admin'],
};
