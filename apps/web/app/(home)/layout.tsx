import "../globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Navbar } from "../../components/Nav";
import Footer from "../../components/Footer";
import { ToastProvider } from "@/components/Toastcontainer";
import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "Viraj multipurpose hall",
  description: "A multipurpose hall for all your events",
  openGraph: {
    title: "Viraj multipurpose hall",
    description: "A multipurpose hall for all your events",
    images: [
      "https://www.bing.com/images/search?view=detailV2&ccid=1oyu%2bc4m&id=47176EC46E3C02B08CEAF91DD047FB9EDC48D7ED&thid=OIP.1oyu-c4mFnVfXh5J2EU2mgHaE8&mediaurl=https%3a%2f%2fget.pxhere.com%2fphoto%2fbest-traditional-wedding-photography-bride-marriage-ceremony-fashion-accessory-jewellery-event-tradition-groom-wedding-reception-interaction-sari-bridal-clothing-love-abdomen-ritual-wedding-dress-temple-girl-smile-mehndi-romance-trunk-gown-1454943.jpg&exph=1280&expw=1920&q=marrrge&simid=608025683554300012&FORM=IRPRST&ck=36429A4EC1A1FAF9B6508175338C384D&selectedIndex=1&itb=0"
    ],
    url:"https://www.virajmultipurposehall.site/",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <SessionProvider>
         <Navbar />

        {children}
        <ToastProvider aria-label="Notification" />
        <Footer />
        </SessionProvider>
       
        </body>
    </html>
  );
}
