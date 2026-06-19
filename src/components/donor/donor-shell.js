"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearAdminSession,
  logoutAdmin,
  refreshAdminSession,
} from "@/app/admin/actions";
import {
  clearLoginUserInformation,
  setLoginUserInformation,
  shouldRefreshLoginSession,
} from "@/lib/auth/auth-storage-service";

const navItems = [
  { label: "Dashboard", href: "/doner", icon: "dashboard" },
  { label: "Payment History", href: "/doner/payment-history", icon: "payment" },
  { label: "Profile Update", href: "/doner/profile", icon: "profile" },
];

const routeTitles = {
  "/doner": {
    eyebrow: "Doner Portal",
    title: "My dashboard",
  },
  "/doner/payment-history": {
    eyebrow: "My Donations",
    title: "Payment history",
  },
  "/doner/profile": {
    eyebrow: "My Account",
    title: "Profile update",
  },
};

function resolveRoute(pathname) {
  return routeTitles[pathname] ?? routeTitles["/doner"];
}

function Icon({ name }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
  };

  if (name === "payment") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg {...common}>
        <path d="M19 20a7 7 0 0 0-14 0" strokeLinecap="round" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17 15 12l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 12H3" strokeLinecap="round" />
        <path d="M21 4v16" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 5a1 1 0 0 1 1-1h5v7H4V5ZM14 4h5a1 1 0 0 1 1 1v4h-6V4ZM4 15h6v5H5a1 1 0 0 1-1-1v-4ZM14 13h6v6a1 1 0 0 1-1 1h-5v-7Z" />
    </svg>
  );
}

function NavLink({ item, onNavigate }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/doner" ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        isActive
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </Link>
  );
}

function Sidebar({ user, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-emerald-100 bg-[linear-gradient(135deg,#064e3b,#0f766e_55%,#155e75)] px-5 py-5">
        <Link
          href="/"
          className="inline-flex rounded-2xl border border-white/25 bg-white px-3 py-2 shadow-sm"
          onClick={onNavigate}
        >
          <Image
            src="/logo.png"
            alt="Mir Faruk & Rima Foundation"
            width={180}
            height={120}
            priority
            className="h-16 w-36 object-contain"
          />
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-100">
          Doner Portal
        </p>
        <p className="mt-2 text-lg font-black text-white">Personal giving area</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <p className="truncate text-sm font-bold text-slate-950">{user.name}</p>
          <p className="mt-1 truncate text-xs font-semibold text-emerald-800">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action={logoutAdmin} onSubmit={clearLoginUserInformation}>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
      >
        <Icon name="logout" />
        Logout
      </button>
    </form>
  );
}

export function DonorShell({ children, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const route = resolveRoute(pathname);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!shouldRefreshLoginSession()) {
      return;
    }

    let isMounted = true;

    async function refreshSession() {
      const result = await refreshAdminSession();

      if (!isMounted) {
        return;
      }

      if (result.success && result.session) {
        setLoginUserInformation(result.session);
        router.refresh();
        return;
      }

      clearLoginUserInformation();
      await clearAdminSession();
      router.replace("/login");
    }

    void refreshSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f4fbf7] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-hidden border-r border-emerald-100 bg-white shadow-sm shadow-emerald-950/5 lg:block">
        <Sidebar user={user} />
      </aside>

      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              {route.eyebrow}
            </p>
            <p className="text-base font-black text-slate-950">{route.title}</p>
          </div>
          <button
            type="button"
            aria-label={isOpen ? "Close donor menu" : "Open donor menu"}
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <Icon name={isOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close donor menu overlay"
          className="absolute inset-0 bg-slate-950/40"
          onClick={() => setIsOpen(false)}
        />
        <aside
          className={`relative h-full w-[min(20rem,86vw)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar user={user} onNavigate={() => setIsOpen(false)} />
        </aside>
      </div>

      <main className="lg:pl-72">
        <div className="sticky top-0 z-20 hidden border-b border-emerald-100 bg-white/90 px-8 py-4 backdrop-blur lg:block">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                {route.eyebrow}
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">{route.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800"
              >
                Public Site
              </Link>
              <LogoutButton />
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900 text-xs font-black text-white">
                  {user.initials ?? "DN"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
