const statusClassNames = {
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Review: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

export function RegistrationTable({ registrations }) {
  return (
    <section className="overflow-hidden rounded-xl border border-cyan-100 bg-white shadow-sm shadow-cyan-950/5">
      <div className="border-b border-cyan-100 bg-[linear-gradient(90deg,#ffffff,#ecfeff)] p-5">
        <h2 className="text-lg font-bold text-slate-950">Recent Registrations</h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest donor, beneficiary, and volunteer submissions.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {registrations.map((item) => (
              <tr key={`${item.name}-${item.date}`} className="transition hover:bg-cyan-50/40">
                <td className="px-5 py-4 font-semibold text-slate-950">{item.name}</td>
                <td className="px-5 py-4 text-slate-600">{item.type}</td>
                <td className="px-5 py-4 text-slate-600">{item.date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      statusClassNames[item.status] ?? statusClassNames.Review
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
