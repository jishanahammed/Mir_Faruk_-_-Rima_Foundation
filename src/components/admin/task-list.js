export function TaskList({ tasks }) {
  return (
    <section className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <h2 className="text-lg font-bold text-slate-950">Today&apos;s Focus</h2>
      <div className="mt-5 space-y-3">
        {tasks.map((task, index) => (
          <label
            key={task}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700"
          >
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              defaultChecked={index === 0}
            />
            <span>{task}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
