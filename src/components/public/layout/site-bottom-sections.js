"use client";

import { usePathname } from "next/navigation";

export function SiteBottomSections({ children }) {
  const pathname = usePathname();

  if (pathname?.replace(/\/+$/, "") === "/about/advisory-council") {
    return null;
  }

  return <div className="mx-auto w-full max-w-[1536px]">{children}</div>;
}
