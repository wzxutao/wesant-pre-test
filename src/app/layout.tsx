import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "问题3 - 卡片拖拽",
  description: "问题3 - 卡片拖拽",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
