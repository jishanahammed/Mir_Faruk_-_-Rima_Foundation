"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  clearAdminSession,
  logoutAdmin,
  refreshAdminSession,
} from "@/app/admin/actions";
import { adminUser } from "@/lib/admin-auth";
import {
  clearLoginUserInformation,
  setLoginUserInformation,
  shouldRefreshLoginSession,
} from "@/lib/auth/auth-storage-service";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Donor List", href: "/admin/donors", icon: "users" },
  { label: "Beneficiary List", href: "/admin/beneficiaries", icon: "list" },
];

const routeTitles = {
  "/admin": {
    eyebrow: "Admin Dashboard",
    title: "Foundation operations",
  },
  "/admin/donors": {
    eyebrow: "Donor Management",
    title: "Donor list",
  },
  "/admin/beneficiaries": {
    eyebrow: "Beneficiary Management",
    title: "Beneficiary list",
  },
  "/admin/registrations": {
    eyebrow: "Review Queue",
    title: "Registrations",
  },
  "/admin/profile": {
    eyebrow: "Account",
    title: "Profile",
  },
  "/admin/settings": {
    eyebrow: "Control Center",
    title: "Settings",
  },
};

function resolveRoute(pathname) {
  if (pathname.startsWith("/admin/beneficiaries/")) {
    return {
      eyebrow: "Beneficiary Management",
      title: "Beneficiary details",
    };
  }

  if (pathname.startsWith("/admin/donors/")) {
    return {
      eyebrow: "Donor Management",
      title: "Donor profile",
    };
  }

  return routeTitles[pathname] ?? routeTitles["/admin"];
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

  if (name === "list") {
    return (
      <svg {...common}>
        <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
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

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 19a4 4 0 0 0-8 0" strokeLinecap="round" />
        <circle cx="12" cy="11" r="3" />
        <path d="M5 19a3 3 0 0 1 2-2.82" strokeLinecap="round" />
        <path d="M19 19a3 3 0 0 0-2-2.82" strokeLinecap="round" />
        <path d="M7 10a2.5 2.5 0 1 1 0-5" strokeLinecap="round" />
        <path d="M17 10a2.5 2.5 0 1 0 0-5" strokeLinecap="round" />
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

  if (name === "settings") {
    return (
      <svg {...common}>
        <path
          d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.08A1.7 1.7 0 0 0 8.96 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.08A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 0 1 7.03 4.2l.06.06A1.7 1.7 0 0 0 8.96 4.6 1.7 1.7 0 0 0 10 3.08V3a2 2 0 0 1 4 0v.08A1.7 1.7 0 0 0 15.04 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.08A1.7 1.7 0 0 0 19.4 15Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive
        ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </Link>
  );
}

function SettingsDropdown({ user = adminUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event) {
      if (menuRef.current?.contains(event.target)) {
        return;
      }

      setIsMenuOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="Open admin settings menu"
        onClick={() => setIsMenuOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-800 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      >
        <Icon name="settings" />
      </button>

      {isMenuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-2xl shadow-slate-950/10 ring-1 ring-slate-950/5"
        >
          <div className="bg-[linear-gradient(135deg,#0f172a,#155e75)] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-sm font-bold ring-1 ring-white/20">
                {user.initials ?? "FA"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <p className="truncate text-xs font-medium text-cyan-100">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1 p-2">
            <Link
              href="/admin/profile"
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
            >
              <Icon name="profile" />
              <span>Profile information</span>
            </Link>
            <Link
              href="/admin/settings"
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
            >
              <Icon name="settings" />
              <span>Admin settings</span>
            </Link>
            <Link
              href="/"
              role="menuitem"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
            >
              <Icon name="dashboard" />
              <span>Public site</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 p-2">
            <form action={logoutAdmin} onSubmit={clearLoginUserInformation}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl bg-slate-950 px-3 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                <Icon name="logout" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent({
  onNavigate,
  onToggle,
  isCollapsed = false,
  user = adminUser,
}) {
  const pathname = usePathname();

  return (
    <div className="relative h-full overflow-hidden bg-white">
      <div
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "translate-x-0 opacity-100"
            : "-translate-x-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col items-center bg-white px-3 py-5">
          <button
            type="button"
            aria-label="Open admin sidebar"
            onClick={onToggle}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-cyan-200 hover:text-cyan-800"
          >
            <Icon name="menu" />
          </button>

          <nav className="mt-5 flex flex-1 flex-col items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onNavigate}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    isActive
                      ? "border-cyan-200 bg-cyan-50 text-cyan-800 shadow-sm shadow-cyan-100/80"
                      : "border-transparent text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                  }`}
                >
                  <Icon name={item.icon} />
                </Link>
              );
            })}
          </nav>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
            {user.initials ?? "FA"}
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "translate-x-3 opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div className="flex h-full flex-col bg-white">
          <div className="flex items-center justify-between gap-3 border-b-2 border-cyan-600 bg-[linear-gradient(135deg,#0f766e,#0891b2_52%,#155e75)] px-4 py-4 text-slate-700">
            <Link
              href="/"
              className="min-w-0 rounded-2xl border border-cyan-500 bg-white px-3 py-2 shadow-sm shadow-cyan-950/5 transition hover:border-cyan-600"
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
            <button
              type="button"
              aria-label="Close admin sidebar"
              onClick={onToggle}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500 bg-white text-cyan-800 transition hover:border-cyan-600 hover:bg-cyan-50"
            >
              <Icon name="menu" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-3">
              <p className="text-sm font-semibold text-slate-950">{user.name}</p>
              <p className="mt-1 text-xs text-cyan-800">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, user = adminUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const route = resolveRoute(pathname);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("mir_admin_sidebar_visible");

    if (storedValue === "false") {
      setIsSidebarVisible(false);
    }
  }, []);

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

  function updateSidebarVisibility(nextValue) {
    setIsSidebarVisible(nextValue);
    window.localStorage.setItem("mir_admin_sidebar_visible", String(nextValue));
  }

  return (
    <div className="min-h-screen bg-[#f5fbfc] text-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-slate-200 bg-white shadow-sm shadow-cyan-950/5 transition-[width,box-shadow] duration-300 ease-in-out lg:block ${
          isSidebarVisible ? "w-72" : "w-[76px]"
        }`}
      >
        <SidebarContent
          user={user}
          isCollapsed={!isSidebarVisible}
          onToggle={() => updateSidebarVisibility(!isSidebarVisible)}
        />
      </aside>

      <header className="sticky top-0 z-20 border-b border-cyan-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              {route.eyebrow}
            </p>
            <p className="text-base font-bold text-slate-950">{route.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <SettingsDropdown user={user} />
            <button
              type="button"
              aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <Icon name={isOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close admin menu overlay"
          className="absolute inset-0 bg-slate-950/40"
          onClick={() => setIsOpen(false)}
        />
        <aside
          className={`relative h-full w-[min(20rem,86vw)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent user={user} onNavigate={() => setIsOpen(false)} />
        </aside>
      </div>

      <main
        className={`transition-[padding] duration-300 ${
          isSidebarVisible ? "lg:pl-72" : "lg:pl-[76px]"
        }`}
      >
        <div className="sticky top-0 z-20 hidden border-b border-cyan-100 bg-white/90 px-8 py-4 backdrop-blur lg:block">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                {route.eyebrow}
              </p>
              <p className="mt-1 text-xl font-bold text-slate-950">{route.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-800"
              >
                Public Site
              </Link>
              <SettingsDropdown user={user} />
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                  {user.initials ?? "FA"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {user.name}
                  </p>
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
