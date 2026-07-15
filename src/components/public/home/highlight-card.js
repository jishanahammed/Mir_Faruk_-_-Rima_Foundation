"use client";

// Reusable highlight card in the "Core Purpose" style: an uppercase amber
// label, a highlighted line and optional tag pills. All parts are optional —
// pass only what the page needs.
export function HighlightCard({ label, text, tags = [] }) {
  return (
    <div className="rounded-[2rem] border border-amber-100 bg-[linear-gradient(135deg,_rgba(255,251,235,0.95),_rgba(255,255,255,0.98),_rgba(236,254,255,0.9))] p-5 shadow-lg shadow-amber-100/40">
      {label ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-amber-700 uppercase">
          {label}
        </p>
      ) : null}

      {text ? (
        <p className="mt-3 max-w-2xl text-base font-medium leading-8 text-slate-800 sm:text-lg">
          {text}
        </p>
      ) : null}

      {tags.length > 0 ? (
        <ul className="mt-3 flex list-none flex-wrap items-center gap-x-3 gap-y-1 p-0 text-sm font-semibold">
          {tags.map((tag, index) => (
            <li key={tag} className="flex items-center gap-x-3">
              {index > 0 ? (
                <span className="text-slate-300" aria-hidden="true">
                  •
                </span>
              ) : null}
              <span
                className={
                  ["text-teal-700", "text-cyan-700", "text-amber-700"][index % 3]
                }
              >
                {tag}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
