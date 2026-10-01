import { BankInfo } from "@/components/public/home/bank-info";
import { SiteFooter } from "@/components/public/layout/site-footer";
import { SiteHeader } from "@/components/public/layout/site-header";
import { SiteBottomSections } from "@/components/public/layout/site-bottom-sections";
import { LocaleProvider } from "@/components/public/providers/locale-provider";
import FeedbackPage from "./feedback/page";

export default function PublicLayout({ children }) {
  return (
    <LocaleProvider>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1536px] flex-1">{children}</main>
        <SiteBottomSections>
          <FeedbackPage />
          <BankInfo />
        </SiteBottomSections>
        <SiteFooter />
      </div>
    </LocaleProvider>

  );
}
