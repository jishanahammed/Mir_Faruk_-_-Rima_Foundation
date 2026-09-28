import { connection } from "next/server";
import { AdvisoryCouncilPage } from "@/components/public/advisory-council/advisory-council-page";
import { getPublicAdvisoryCouncil } from "@/lib/api/public-advisory-council-service";

export const metadata = {
  title: "Advisory Council | Mir Faruk & Rima Foundation",
  description: "Meet the advisors who guide Mir Faruk & Rima Foundation with their experience and insight.",
};

export default async function PublicAdvisoryCouncilPage() {
  await connection();
  const { members, loadError } = await getPublicAdvisoryCouncil();

  return <AdvisoryCouncilPage members={members} loadError={loadError} />;
}
