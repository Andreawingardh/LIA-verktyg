import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header.js";
import Footer from "./components/footer/Footer.js";
import "@/assets/styles/fonts.css";
import { Inter } from "next/font/google";
import { styles } from "@/app/page.module.css";


const inter = Inter();


export const metadata = {
  organization: "YRGO",
  title: "Internify",
  description: "YRGO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">


      <body className={inter.variable}>

        <Header metadata={metadata} />
        <main>{children}</main>
        <Footer metadata={metadata} />
      </body>
    </html>
  );
}
