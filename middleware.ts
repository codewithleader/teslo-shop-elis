import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // console.log(req.nextUrl);
  if (req.nextUrl.pathname.startsWith('/checkout/')) {
    // console.log(req.cookies)
    // const { token } = req.cookies; // ! opcion #1: Property 'token' does not exist on type 'NextCookies'.
    // const { token } = req.cookies['token']; // ! opcion #2: Tampoco funciona
    const token = req.cookies.get('token') || ''; // * opcion #3: si funciona
    console.log(token);

    return NextResponse.next();
  }
}

export const config = {
  matcher: '/checkout/:path/',
};
