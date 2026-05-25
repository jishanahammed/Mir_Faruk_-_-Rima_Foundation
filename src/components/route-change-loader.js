"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function isSameRoute(url) {
  return (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  );
}

export function RouteChangeLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function stopLoading(delay = 180) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }

    stopLoading();

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    function startLoading() {
      window.clearTimeout(timeoutRef.current);
      setIsLoading(true);
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    }

    function handleClick(event) {
      if (event.defaultPrevented || event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const anchor = event.target?.closest?.("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin || isSameRoute(nextUrl)) {
        return;
      }

      startLoading();
    }

    function handlePopState() {
      startLoading();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-hidden={!isLoading}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[9999] transition-opacity duration-200 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-1 overflow-hidden bg-cyan-100/80">
        <div className="h-full w-1/2 animate-[route-loader_1.1s_ease-in-out_infinite] rounded-r-full bg-[linear-gradient(90deg,#06b6d4,#0f766e,#0f172a)] shadow-lg shadow-cyan-400/40" />
      </div>
      <div className="mx-auto mt-3 flex w-full max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
        <div className="rounded-full border border-cyan-100 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-800 shadow-xl shadow-cyan-950/10 backdrop-blur">
          Loading...
        </div>
      </div>
    </div>
  );
}
