export function DashboardPanel({
  title,
  description,
  eyebrow,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`overflow-hidden rounded-[28px] border border-cyan-100 bg-white shadow-[0_20px_70px_-45px_rgba(14,116,144,0.45)] ${className}`}
    >
      <div className="border-b border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,0.9),rgba(248,250,252,0.95))] px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
            {description ? <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}
