import { Navbar } from "@/components/Nav";
import "../globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toastcontainer";
import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "Viraj multipurpose hall",
  description: "Generated by sj",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
         <Navbar />
        {children}
               <ToastProvider aria-label="Notification Toasts" />
  
        <Footer />
        </SessionProvider>
        </body>
    </html>
  );
}
