export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold tracking-[0.32em] text-cyan-700 uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-600 md:text-lg">
        {description}
      </p>
    </div>
  );
}
