import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "SponsorMap — Sponsorship operations & performance reporting",
  description:
    "SponsorMap turns sponsorship agreements into tracked commitments, assigned fulfilment tasks, verified evidence and sponsor-ready reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
