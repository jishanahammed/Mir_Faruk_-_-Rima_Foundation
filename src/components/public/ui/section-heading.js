export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl space-y-2 text-center sm:mx-0 sm:space-y-3 sm:text-left">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-cyan-700 uppercase sm:text-xs sm:tracking-[0.32em]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 md:text-lg">
        {description}
      </p>
    </div>
  );
}
