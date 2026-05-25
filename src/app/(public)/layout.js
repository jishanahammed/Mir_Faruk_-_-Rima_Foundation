import { SiteFooter } from "@/components/public/layout/site-footer";
import { SiteHeader } from "@/components/public/layout/site-header";
import { LocaleProvider } from "@/components/public/providers/locale-provider";

export default function PublicLayout({ children }) {
  return (
    <LocaleProvider>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </LocaleProvider>
  );
}
