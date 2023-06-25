import "./globals.css";
import { Inter } from "@next/font/google";
import Link from "next/link";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <main>
          <Link href="/">
            <h1>TDL</h1>
          </Link>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
