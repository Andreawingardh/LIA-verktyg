import "./globals.css";
import Header from "./components/header/Header.js";
import Footer from "./components/footer/Footer.js";
import "@/assets/styles/fonts.css";
import { Inter } from "next/font/google";
import { Unna } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const unna = Unna({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-unna",
});

export const metadata = {
  organization: "YRGO",
  title: "Internify",
  description: "YRGO",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv" className={`${inter.variable} ${unna.variable}`}>
      <body className={`${inter.variable} ${unna.variable}`}>
        <Header metadata={metadata} />
        <main>{children}</main>
        <Footer metadata={metadata} />
      </body>
    </html>
  );
}
