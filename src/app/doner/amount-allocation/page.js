import { AmountAllocationPanel } from "@/components/donor/amount-allocation-panel";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  getDonorAssignablePayments,
  getDonorAvailableAmountSummary,
  getAllocationOptions,
} from "@/lib/api/donor-amount-assignment-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const metadata = {
  title: "Amount Allocation | Mir Faruk & Rima Foundation",
};

export default async function AmountAllocationPage() {
  const user = await getCurrentDonorUser();

  let summary = {
    donorId: 0,
    totalPaymentAmount: 0,
    totalAssignedAmount: 0,
    totalPendingAmount: 0,
    totalApprovedAmount: 0,
    totalAvailableAmount: 0,
  };
  let assignablePayments = [];
  let errorMessage = "";
  let initialOptions = null;

  const results = await Promise.allSettled([getDonorAvailableAmountSummary(user), getDonorAssignablePayments(user), getAllocationOptions()]);
  if (results[0].status === "fulfilled") summary = results[0].value;
  if (results[1].status === "fulfilled") assignablePayments = results[1].value;
  if (results[2].status === "fulfilled") initialOptions = results[2].value;
  const errors = results.filter((result) => result.status === "rejected");
  if (errors.length) errorMessage = getApiErrorMessage(errors[0].reason);

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load allocation data</strong>
          {errorMessage}
        </section>
      ) : null}

      <AmountAllocationPanel
        initialSummary={summary}
        initialAssignablePayments={assignablePayments}
        initialOptions={initialOptions}
      />
    </div>
  );
}
