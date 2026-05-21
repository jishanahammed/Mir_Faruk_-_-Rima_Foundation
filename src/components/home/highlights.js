import { highlights } from "@/lib/site-data";

export function Highlights() {
  return (
    <section className="px-6 py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm"
          >
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
