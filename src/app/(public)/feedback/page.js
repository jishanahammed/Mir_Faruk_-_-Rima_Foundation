import { CustomerFeedbackSection } from "@/components/public/home/customer-feedback-section";
import { CustomerFeedbackShowcase } from "@/components/public/home/customer-feedback-showcase";
import { getPublishedCustomerFeedback } from "@/lib/api/public-customer-feedback-service";

export const metadata = {
  title: "Customer Feedback | Mir Faruk & Rima Foundation",
};

export default async function FeedbackPage() {
  const publishedFeedback = await getPublishedCustomerFeedback();

  return (
    <>
      <CustomerFeedbackShowcase
        items={publishedFeedback}
        text={{ eyebrow: "What people are saying", title: "Customer Feedback" }}
      />
      <CustomerFeedbackSection />
    </>
  );
}
