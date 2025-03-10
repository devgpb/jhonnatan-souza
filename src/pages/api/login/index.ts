// pages/api/brokers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
      }
    
      const { email, senha } = req.body;
      const LOGIN = process.env.LOGIN;
      const SENHA = process.env.SENHA;
    
      if (email === LOGIN && senha === SENHA) {
        // Em produção, gere um token (por exemplo, JWT) e valide-o posteriormente.
        const token = "token-autenticado";
    
        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true, // não acessível via JavaScript
            secure: process.env.NODE_ENV !== "development", // HTTPS em produção
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: "/",
          })
        );
    
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
}


