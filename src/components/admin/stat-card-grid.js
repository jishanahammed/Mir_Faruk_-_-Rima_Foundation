const toneClassNames = {
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
  emerald: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatCardGrid({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-950/5"
        >
          <div
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              toneClassNames[item.tone] ?? toneClassNames.cyan
            }`}
          >
            {item.change}
          </div>
          <p className="mt-5 text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {item.value}
          </p>
        </article>
      ))}
    </div>
  );
}
