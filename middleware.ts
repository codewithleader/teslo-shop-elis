import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwt } from './utils';

export async function middleware(req: NextRequest, e: NextFetchEvent) {
  // console.log(req.nextUrl);
  if (req.nextUrl.pathname.startsWith('/checkout/')) {
    const token = req.cookies.get('token') || '';
    // console.log(token);
    // console.log({page: req.nextUrl.pathname});
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();

    // ! nada de lo que hay aqui en esta funcion sirve 😃

    try {
      // await jwt.isValidToken(token); //! No funciona las utils en los middlewares
      // return NextResponse.next();
      url.pathname = `/auth/login?page=${requestedPage}`;
      return NextResponse.redirect(url);
      // return NextResponse.redirect(`/auth/login?page=${requestedPage}`);
    } catch (error) {
      return NextResponse.redirect(url);
      // return NextResponse.redirect(`/auth/login?page=${requestedPage}`);
    }
  }
}

export const config = {
  matcher: '/checkout/:path/',
};
