import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, MobileTabBar } from "@/components/nav";

export const metadata: Metadata = {
  title: "English Board",
  description: "Personal English & communication practice board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-5 py-6 pb-24 md:pb-6 max-w-3xl mx-auto w-full">{children}</main>
        </div>
        <MobileTabBar />
      </body>
    </html>
  );
}
