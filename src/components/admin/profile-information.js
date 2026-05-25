import { adminUser } from "@/lib/admin-auth";

export function ProfileInformation({ user = adminUser }) {
  const details = [
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone || "Not provided" },
    { label: "Location", value: user.location || "Not provided" },
    { label: "Role", value: user.role },
  ];

  return (
    <section className="rounded-xl border border-cyan-100 bg-white p-5 shadow-sm shadow-cyan-950/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-xl font-bold text-white">
          {user.initials ?? "FA"}
        </div>
        <div>
          <p className="text-xl font-bold text-slate-950">{user.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user.role}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
