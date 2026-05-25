export const metadata = {
  title: "Admin Settings | Mir Faruk & Rima Foundation",
};

const settings = [
  {
    title: "Dashboard Access",
    description: "Admin route protection is active through the session cookie.",
    value: "Enabled",
  },
  {
    title: "Public Registration",
    description: "General users can still access public registration pages.",
    value: "Open",
  },
  {
    title: "Review Workflow",
    description: "Applications are grouped by donor, beneficiary, and volunteer type.",
    value: "Manual review",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-cyan-100 bg-[linear-gradient(135deg,#0f172a,#155e75)] p-6 text-white shadow-sm shadow-cyan-950/10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Admin control settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50">
          Manage the operational defaults that keep the dashboard organized,
          protected, and ready for review work.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {settings.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-950/5"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-bold text-slate-950">{item.title}</h2>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-200">
                {item.value}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-950/5">
        <h2 className="text-lg font-bold text-slate-950">Brand Appearance</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="h-10 rounded-lg bg-slate-950" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Deep Slate</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="h-10 rounded-lg bg-cyan-500" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Foundation Cyan</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="h-10 rounded-lg bg-teal-700" />
            <p className="mt-3 text-sm font-semibold text-slate-950">Trust Teal</p>
          </div>
        </div>
      </section>
    </div>
  );
}
