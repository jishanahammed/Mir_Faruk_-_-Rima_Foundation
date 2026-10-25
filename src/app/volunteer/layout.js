import { VolunteerShell } from "@/components/volunteer/volunteer-shell";
import { getCurrentVolunteerUser } from "@/lib/volunteer-session";

export const metadata = { title: "Volunteer Portal | Mir Faruk & Rima Foundation" };

export default async function VolunteerLayout({ children }) {
  const user = await getCurrentVolunteerUser();
  return <VolunteerShell user={user}>{children}</VolunteerShell>;
}
