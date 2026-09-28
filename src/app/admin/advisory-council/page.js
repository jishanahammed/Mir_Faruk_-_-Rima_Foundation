import { getAdvisoryCouncil } from "@/lib/api/admin-advisory-council-service";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { AdvisoryCouncilManager } from "@/components/admin/advisory-council-manager";

export const metadata = { title: "Advisory Council | Admin | Mir Faruk & Rima Foundation" };

export default async function AdvisoryCouncilPage() {
  let members = [];
  let error = "";
  try {
    members = await getAdvisoryCouncil();
  } catch (cause) {
    error = getApiErrorMessage(cause);
  }

  return <AdvisoryCouncilManager members={members} loadError={error} />;
}
