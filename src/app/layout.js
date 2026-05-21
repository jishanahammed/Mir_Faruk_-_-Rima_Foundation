import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LocaleProvider } from "@/components/providers/locale-provider";

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
        <LocaleProvider>
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
