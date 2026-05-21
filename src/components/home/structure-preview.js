import { SectionHeading } from "@/components/ui/section-heading";
import { structureGroups } from "@/lib/site-data";

export function StructurePreview() {
  return (
    <section id="structure" className="px-6 py-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <SectionHeading
          eyebrow="Folder Structure"
          title="Organized around routing, reuse, and future growth."
          description="The project no longer keeps everything in a single route file. Each responsibility has a clear place so new features can be added without turning the root into a dumping ground."
        />

        <div className="rounded-[2rem] border border-white/10 bg-stone-900/70 p-6 shadow-2xl shadow-black/20">
          <div className="space-y-6">
            {structureGroups.map((group) => (
              <div key={group.label} className="space-y-3">
                <p className="text-sm font-semibold tracking-[0.24em] text-amber-300 uppercase">
                  {group.label}
                </p>
                <ul className="space-y-2 text-sm text-stone-300">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-white/6 bg-white/4 px-4 py-3 font-mono"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
