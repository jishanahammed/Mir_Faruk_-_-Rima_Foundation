import { Geist, Geist_Mono } from "next/font/google";
import { RouteChangeLoader } from "@/components/route-change-loader";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mir Faruk & Rima Foundation",
  description:
    "A transparent and Shariah-compliant foundation platform focused on social support and self-reliance.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-locale="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-white text-slate-900 antialiased">
        <RouteChangeLoader />
        {children}
      </body>
    </html>
  );
}
