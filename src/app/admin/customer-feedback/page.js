import { CustomerFeedbackTable } from "@/components/admin/customer_feedback/customer-feedback-table";
import { getApiErrorMessage } from "@/lib/api/api-error";
import {
  CUSTOMER_FEEDBACK_STATUS_OPTIONS,
  getAdminCustomerFeedbackList,
} from "@/lib/api/admin-customer-feedback-service";

export const metadata = {
  title: "Customer Feedback | Mir Faruk & Rima Foundation",
};

function readParam(params, key, fallback = "") {
  const value = params?.[key];
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

export default async function AdminCustomerFeedbackPage({ searchParams }) {
  const params = await searchParams;
  const status = CUSTOMER_FEEDBACK_STATUS_OPTIONS.find(
    (option) => option.toLowerCase() === readParam(params, "status").toLowerCase(),
  ) || "";

  let feedbackItems = [];
  let errorMessage = "";

  try {
    feedbackItems = await getAdminCustomerFeedbackList(status || undefined);
  } catch (error) {
    errorMessage = getApiErrorMessage(error);
  }

  return (
    <div className="space-y-5 xl:space-y-6">
      {errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          <strong className="block font-semibold">Unable to load customer feedback</strong>
          {errorMessage}
        </section>
      ) : null}

      <CustomerFeedbackTable items={feedbackItems} status={status} />
    </div>
  );
}
