import { DonorShell } from "@/components/donor/donor-shell";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Doner Portal | Mir Faruk & Rima Foundation",
};

export default async function DonerLayout({ children }) {
  const user = await getCurrentDonorUser();

  return <DonorShell user={user}>{children}</DonorShell>;
}
