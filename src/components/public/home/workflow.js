import { SectionHeading } from "@/components/public/ui/section-heading";
import { workflowSteps } from "@/lib/site-data";

export function Workflow() {
  return (
    <section id="workflow" className="px-6 py-20 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <SectionHeading
          eyebrow="Workflow"
          title="A practical structure for day-to-day development."
          description="This setup stays simple now, while still giving the project obvious places for new pages, shared UI, and supporting code."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <article
              key={step}
              className="rounded-3xl border border-white/10 bg-stone-900/55 p-6"
            >
              <p className="text-sm font-semibold text-amber-300">
                0{index + 1}
              </p>
              <p className="mt-4 text-base leading-7 text-stone-200">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
