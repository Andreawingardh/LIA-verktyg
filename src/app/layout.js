import "./globals.css";
import Header from "./components/header/Header.js";
import Footer from "./components/footer/Footer.js";
import "@/assets/styles/fonts.css";
import { Inter } from "next/font/google";
import { Unna } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const unna = Unna({
  weight: ["400", "700"], // Add this line to specify the weights
  subsets: ["latin"],
});

export const metadata = {
  organization: "YRGO",
  title: "Internify",
  description: "YRGO",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} ${unna.variable}`}>
        <Header metadata={metadata} />
        <main>{children}</main>
        <Footer metadata={metadata} />
      </body>
    </html>
  );
}
