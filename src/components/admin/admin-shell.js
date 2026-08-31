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

const navSections = [
  {
    section: "Dashboard",
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    section: "Organization",
    items: [
      { label: "Board Members", href: "/admin/Board_Member_Page", icon: "board" },
      { label: "Locations", href: "/admin/location-page", icon: "location" },
      { label: "CEO Bani", href: "/admin/CeoBani", icon: "profile" },
      { label: "Video Speech", href: "/admin/video-speech", icon: "folder" }
    ],
  },

  {
    section: "Management",
    items: [
      { label: "Donor List", href: "/admin/donors", icon: "users" },
      { label: "Beneficiary List", href: "/admin/beneficiaries", icon: "list" },
      { label: "Payment History", href: "/admin/donersPayment", icon: "payment" },
      { label: "Amount Assignment", href: "/admin/amount-assignment", icon: "payment" },
      { label: "Customer Feedback", href: "/admin/customer-feedback", icon: "list" },
    ],
  },


  {
    section: "Projects",
    items: [
      {
        label: "Projects",
        icon: "folder",
        children: [
          { label: "Project Category", href: "/admin/project-category", icon: "project" },
          { label: "Foundation Projects", href: "/admin/Foundation_Projects", icon: "folder" },
          { label: "Project Blogs", href: "/admin/Project_Blogs", icon: "folder" },
          { label: "Assistance Types", href: "/admin/assistance-type", icon: "project" },
          { label: "Project Assistance", href: "/admin/project-assistance", icon: "folder" },
        ],
      },
    ],
  },
  {
    section: "Emergency",
    items: [
      {
        label: "Emergency",
        icon: "emergency",
        children: [
          { label: "Emergency Category", href: "/admin/Emergency_Category", icon: "project" },
          { label: "Emergency Donation", href: "/admin/Emergency_Donation", icon: "emergency" },
        ],
      },
    ],
  },


];

function flattenNavItems(sections) {
  return sections.flatMap((s) => s.items.flatMap((item) => (item.children ? item.children : [item])));
}

const routeTitles = {
  "/admin": {
    eyebrow: "Admin Dashboard",
    title: "Foundation operations",
  },
  "/admin/donors": {
    eyebrow: "Donor Management",
    title: "Donor list",
  },
  "/admin/donersPayment": {
    eyebrow: "Donor Payments",
    title: "Donation / Payment History",
  },
  "/admin/amount-assignment": {
    eyebrow: "Donor Allocations",
    title: "Amount Assignment",
  },
  "/admin/customer-feedback": {
    eyebrow: "Visitor Voices",
    title: "Customer Feedback",
  },
  "/admin/beneficiaries": {
    eyebrow: "Beneficiary Management",
    title: "Beneficiary list",
  },
  "/admin/Board_Member_Page": {
    eyebrow: "Board Management",
    title: "Board members",
  },
  "/admin/location-page": {
    eyebrow: "Master Data",
    title: "Location management",
  },
  "/admin/project-category": {
    eyebrow: "Projects",
    title: "Project Categories",
  },
  "/admin/Foundation_Projects": {
    eyebrow: "Projects",
    title: "Foundation Projects",
  },
  "/admin/Project_Blogs": {
    eyebrow: "Projects",
    title: "Project Blogs",
  },
  "/admin/assistance-type": {
    eyebrow: "Projects",
    title: "Assistance Types",
  },
  "/admin/project-assistance": {
    eyebrow: "Projects",
    title: "Project Assistance",
  },
  "/admin/Emergency_Donation": {
    eyebrow: "Emergency",
    title: "Emergency Donation Campaigns",
  },
  "/admin/Emergency_Category": {
    eyebrow: "Emergency",
    title: "Emergency Categories",
  },
  "/admin/CeoBani": {
    eyebrow: "Content",
    title: "CEO Bani",
  },
  "/admin/video-speech": {
    eyebrow: "Content",
    title: "Video Speeches",
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

  if (pathname.startsWith("/admin/Board_Member_Page/")) {
    return {
      eyebrow: "Board Management",
      title: "Board member",
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

  if (name === "payment") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" strokeLinecap="round" />
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

  if (name === "board") {
    return (
      <svg {...common}>
        <path d="M17 20a5 5 0 0 0-10 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" />
        <path d="M4 20a3 3 0 0 1 2-2.83M20 20a3 3 0 0 0-2-2.83" strokeLinecap="round" />
        <path d="M7 10a2.5 2.5 0 1 1 0-5M17 10a2.5 2.5 0 1 0 0-5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "location") {
    return (
      <svg {...common}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }

  if (name === "project") {
    return (
      <svg {...common}>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "emergency") {
    return (
      <svg {...common}>
        <path d="M12 2 3 7v6c0 5 4 8.5 9 9 5-.5 9-4 9-9V7l-9-5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v5" strokeLinecap="round" />
        <path d="M12 16.5h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "folder") {
    return (
      <svg {...common}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11v6M9 14h6" strokeLinecap="round" />
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

  if (name === "chevron") {
    return (
      <svg {...common} className="h-4 w-4">
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 5a1 1 0 0 1 1-1h5v7H4V5ZM14 4h5a1 1 0 0 1 1 1v4h-6V4ZM4 15h6v5H5a1 1 0 0 1-1-1v-4ZM14 13h6v6a1 1 0 0 1-1 1h-5v-7Z" />
    </svg>
  );
}

function NavLink({ item, onNavigate, indent = false }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href.split("?")[0]);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${indent ? "ml-4" : ""
        } ${isActive
          ? "bg-[linear-gradient(135deg,#4adfd452,#79cde1)] text-black shadow-sm shadow-cyan-200/60"
          : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800"
        }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
    </Link>
  );
}

function NavGroup({ group, onNavigate }) {
  const pathname = usePathname();
  const isChildActive = group.children.some((child) => pathname.startsWith(child.href));
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${isChildActive
          ? "bg-[linear-gradient(135deg,#4adfd452,#79cde1)] text-black shadow-sm shadow-cyan-200/60"
          : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800"
          }`}
      >
        <Icon name={group.icon} />
        <span className="flex-1 text-left">{group.label}</span>
        <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${isChildActive ? "text-black/70" : "text-slate-400"}`}>
          <Icon name="chevron" />
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-0.5 py-0.5">
            {group.children.map((child) => (
              <NavLink key={child.href} item={child} onNavigate={onNavigate} indent />
            ))}
          </div>
        </div>
      </div>
    </div>
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
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${isCollapsed
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
            {flattenNavItems(navSections).map((item) => {
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
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${isActive
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
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${isCollapsed
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

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            {navSections.map((section, index) => (
              <div
                key={section.section ?? `section-${index}`}
                className={index > 0 ? "mt-4 border-t border-slate-100 pt-4" : ""}
              >
                {section.section && (
                  <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {section.section}
                  </p>
                )}
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) =>
                    item.children ? (
                      <NavGroup key={item.label} group={item} onNavigate={onNavigate} />
                    ) : (
                      <NavLink key={item.href} item={item} onNavigate={onNavigate} />
                    )
                  )}
                </div>
              </div>
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
        className={`fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-slate-200 bg-white shadow-sm shadow-cyan-950/5 transition-[width,box-shadow] duration-300 ease-in-out lg:block ${isSidebarVisible ? "w-72" : "w-[76px]"
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
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      >
        <button
          type="button"
          aria-label="Close admin menu overlay"
          className="absolute inset-0 bg-slate-950/40"
          onClick={() => setIsOpen(false)}
        />
        <aside
          className={`relative h-full w-[min(20rem,86vw)] border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <SidebarContent user={user} onNavigate={() => setIsOpen(false)} />
        </aside>
      </div>

      <main
        className={`transition-[padding] duration-300 ${isSidebarVisible ? "lg:pl-72" : "lg:pl-[76px]"
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
