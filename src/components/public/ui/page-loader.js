export function PageLoader({ label = "Loading...", overlay = false, fullscreen = false }) {
  const shellClassName = overlay
    ? "fixed inset-0 z-50 bg-white/76 backdrop-blur-sm"
    : fullscreen
      ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.14),_transparent_42%),linear-gradient(180deg,_#f8fcff_0%,_#ffffff_100%)]"
      : "min-h-[18rem] bg-transparent";

  return (
    <div className={`${shellClassName} flex items-center justify-center px-6`}>
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-cyan-100 bg-white/95 px-8 py-7 text-center shadow-2xl shadow-cyan-100/70">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 rounded-full border-4 border-cyan-100" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-emerald-500 border-t-cyan-500" />
          <span className="absolute inset-[0.7rem] rounded-full bg-cyan-50" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-700 uppercase">
            Faruk &amp; Rima Foundation
          </p>
          <p className="text-sm text-slate-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
