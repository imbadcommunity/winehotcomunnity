import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wine Hot Community | Plataforma Premium de Cursos",
  description:
    "Sua comunidade premium de cursos e networking exclusivo. Acesso ilimitado a cursos, aulas ao vivo e uma comunidade vibrante de profissionais.",
  keywords: ["cursos online", "comunidade", "aprendizado", "networking", "premium"],
  openGraph: {
    title: "Wine Hot Community",
    description: "Plataforma premium de cursos e comunidade exclusiva",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
