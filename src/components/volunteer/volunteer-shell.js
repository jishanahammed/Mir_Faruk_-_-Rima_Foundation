"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession, logoutAdmin, refreshAdminSession } from "@/app/admin/actions";
import { clearLoginUserInformation, setLoginUserInformation, shouldRefreshLoginSession } from "@/lib/auth/auth-storage-service";

const menuItems = [
  { href: "/volunteer", label: "Dashboard", icon: "dashboard" },
  { href: "/volunteer/volunteers", label: "Volunteer List", icon: "volunteers" },
  { href: "/volunteer/profile", label: "My Profile", icon: "profile" },
  { href: "/volunteer/change-password", label: "Change Password", icon: "lock" },
];

function Icon({ name }) {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "menu" ? <path d="M4 7h16M4 12h16M4 17h16" />
      : name === "close" ? <path d="m6 6 12 12M18 6 6 18" />
      : name === "logout" ? <><path d="m10 17 5-5-5-5M15 12H3M21 4v16" /></>
      : name === "profile" ? <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>
      : name === "volunteers" ? <><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2" /></>
      : name === "lock" ? <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>
      : <path d="M4 4h6v7H4zM14 4h6v5h-6zM4 15h6v5H4zM14 13h6v7h-6z" />}
  </svg>;
}

function UserCard({ user }) {
  return <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-base font-black text-white">{user.initials || "VL"}</div>
    <div className="min-w-0"><p className="truncate text-base font-black text-slate-950">{user.name}</p><p className="mt-1 text-sm font-semibold text-emerald-800">Volunteer</p></div>
  </div>;
}

function Sidebar({ user, onNavigate, onClose }) {
  const pathname = usePathname();
  return <div className="flex h-full flex-col bg-white">
    <div className="border-b border-emerald-100 bg-[linear-gradient(135deg,#064e3b,#0f766e_55%,#155e75)] px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <Link href="/" onClick={onNavigate} className="inline-flex rounded-2xl border border-white/25 bg-white px-3 py-2 shadow-sm">
          <Image src="/logo.png" alt="Mir Faruk & Rima Foundation" width={180} height={120} priority className="h-16 w-36 object-contain" />
        </Link>
        {onClose ? <button type="button" aria-label="Close volunteer menu" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/10"><Icon name="close" /></button> : null}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-emerald-100">Volunteer Portal</p>
      <p className="mt-2 text-lg font-black text-white">Volunteer workspace</p>
    </div>
    <nav aria-label="Volunteer navigation" className="flex-1 space-y-2 px-4 py-5">
      {menuItems.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate}
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${pathname === item.href ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
        <Icon name={item.icon} /><span>{item.label}</span>
      </Link>)}
    </nav>
    <div className="border-t border-slate-200 p-4"><div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><UserCard user={user} /></div></div>
  </div>;
}

export function VolunteerShell({ user, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const title = menuItems.find((item) => item.href === pathname)?.label || "Dashboard";
  const [leaving, setLeaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!isOpen) {
      if (drawer.open) drawer.close();
      return;
    }
    drawer.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    function closeOnDesktop(event) { if (event.matches) setIsOpen(false); }
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      if (drawer.open) drawer.close();
    };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;
    let refreshing = false;
    async function refresh() {
      if (refreshing || !shouldRefreshLoginSession()) return;
      refreshing = true;
      try {
        const result = await refreshAdminSession();
        if (cancelled) return;
        if (result.success) {
          setLoginUserInformation(result.session);
          router.refresh();
        } else {
          clearLoginUserInformation();
          await clearAdminSession();
          if (!cancelled) router.replace("/login");
        }
      } finally { refreshing = false; }
    }
    void refresh();
    const timer = setInterval(refresh, 60_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [router]);

  async function signOut() {
    setLeaving(true);
    clearLoginUserInformation();
    await logoutAdmin();
  }

  const logoutButton = <button type="button" disabled={leaving} onClick={signOut} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"><Icon name="logout" />{leaving ? "Signing out…" : "Logout"}</button>;

  return <div className="min-h-screen bg-[#f4fbf7] text-slate-950">
    <aside aria-label="Volunteer sidebar" className="fixed inset-y-0 left-0 z-30 hidden w-72 overflow-hidden border-r border-emerald-100 bg-white shadow-sm shadow-emerald-950/5 lg:block"><Sidebar user={user} /></aside>

    <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Volunteer Portal</p><h1 className="truncate text-base font-black">{title}</h1></div>
        <div className="flex shrink-0 items-center gap-2">{logoutButton}<button type="button" aria-label="Open volunteer menu" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="volunteer-menu" onClick={() => setIsOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"><Icon name="menu" /></button></div>
      </div>
    </header>

    <dialog ref={drawerRef} id="volunteer-menu" aria-label="Volunteer menu" onClose={() => setIsOpen(false)} onClick={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setIsOpen(false);
    }} className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,86vw)] max-w-none border-0 p-0 shadow-2xl backdrop:bg-slate-950/40 lg:hidden">
      <Sidebar user={user} onNavigate={() => setIsOpen(false)} onClose={() => setIsOpen(false)} />
    </dialog>

    <main className="lg:pl-72">
      <div className="sticky top-0 z-20 hidden border-b border-emerald-100 bg-white/90 px-8 py-4 backdrop-blur lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Volunteer Portal</p><h1 className="mt-1 text-xl font-black">{title}</h1></div>
          <div className="flex items-center gap-3"><Link href="/" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800">Public Site</Link>{logoutButton}<div className="max-w-64 rounded-2xl border border-slate-200 bg-white px-4 py-2.5"><UserCard user={user} /></div></div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </main>
  </div>;
}
