import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/store/useChatStore";

export const metadata: Metadata = {
  title: "| Chat Soporte",
  description: "Tus consultas resueltas al instante",
  icons: {
    icon: "/image.png", // icono principal
    shortcut: "/image.png",
    apple: "/image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
