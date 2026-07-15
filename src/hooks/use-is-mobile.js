"use client";

import { useEffect, useState } from "react";

// Matches Tailwind's `md` breakpoint: anything narrower is treated as mobile.
const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile() {
  // Starts false on the server so SSR/hydration markup stays consistent.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}
