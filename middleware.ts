// middleware.js
import { NextResponse } from 'next/server';

interface MiddlewareRequest {
    nextUrl: {
        pathname: string;
    };
    cookies: {
        get: (name: string) => { value: string | undefined } | undefined;
    };
    url: string;
}

export function middleware(request: MiddlewareRequest): NextResponse {
    // Apenas rotas que comecem com /admin serão protegidas
    console.log("middeware")
    const { pathname } = request.nextUrl;
    
    // Se não for uma rota protegida, continua normalmente
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }
    
    // Obtenha o token do cookie
    const token = request.cookies.get('token')?.value;
    
    // Verifique se o token existe e é válido (aqui comparamos com um valor fixo para exemplo)
    if (!token || token !== 'token-autenticado') {
        // Se o usuário não estiver autenticado, redireciona para a página de login
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    
    // Se tudo estiver correto, permite a requisição seguir normalmente
    return NextResponse.next();
}

// Configuração para aplicar o middleware apenas nas rotas desejadas
export const config = {
  matcher: ['/admin/:path*'],
};
