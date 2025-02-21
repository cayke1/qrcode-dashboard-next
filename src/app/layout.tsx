import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard do Qrcode",
  description: "Conteúdo do meu braço kkkkkkkk",
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
