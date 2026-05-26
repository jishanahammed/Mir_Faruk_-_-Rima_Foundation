function SkeletonCard({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />;
}

export default function LoadingBeneficiaryDetails() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] border border-cyan-100 bg-white shadow-xl shadow-cyan-950/5">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4">
              <SkeletonCard className="h-16 w-16 rounded-3xl" />
              <div className="space-y-3">
                <SkeletonCard className="h-3 w-32" />
                <SkeletonCard className="h-8 w-72 max-w-[70vw]" />
                <SkeletonCard className="h-4 w-52" />
                <div className="flex gap-2">
                  <SkeletonCard className="h-8 w-24 rounded-full" />
                  <SkeletonCard className="h-8 w-28 rounded-full" />
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm space-y-3">
              <SkeletonCard className="h-12 w-36" />
              <SkeletonCard className="h-36 w-full rounded-[26px]" />
            </div>
          </div>
        </div>
      </section>

      {[0, 1, 2].map((section) => (
        <section
          key={section}
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-cyan-950/5"
        >
          <div className="border-b border-slate-100 px-6 py-5">
            <SkeletonCard className="h-3 w-24" />
            <SkeletonCard className="mt-3 h-6 w-52" />
            <SkeletonCard className="mt-3 h-4 w-full max-w-2xl" />
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
