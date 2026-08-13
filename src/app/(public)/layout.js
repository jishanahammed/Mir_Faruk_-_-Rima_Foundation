import { BankInfo } from "@/components/public/home/bank-info";
import { SiteFooter } from "@/components/public/layout/site-footer";
import { SiteHeader } from "@/components/public/layout/site-header";
import { LocaleProvider } from "@/components/public/providers/locale-provider";
import FeedbackPage from "./feedback/page";

export default function PublicLayout({ children }) {
  return (
    <LocaleProvider>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <FeedbackPage />
        <BankInfo />
        <SiteFooter />
      </div>
    </LocaleProvider>

  );
}
