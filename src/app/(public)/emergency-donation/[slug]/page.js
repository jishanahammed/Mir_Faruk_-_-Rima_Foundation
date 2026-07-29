import { notFound } from "next/navigation";
import { getPublicEmergencyCampaignBySlug } from "@/lib/api/public-emergency-campaign-service";
import { EmergencyDonationDetailPage } from "@/components/public/emergency-donation/emergency-donation-detail-page";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const campaign = await getPublicEmergencyCampaignBySlug(slug);
  if (!campaign) return { title: "Emergency Donation | Mir Faruk & Rima Foundation" };
  return {
    title: `${campaign.titleEn} | Mir Faruk & Rima Foundation`,
    description: campaign.shortDescriptionEn ?? `Support ${campaign.titleEn}.`,
  };
}

export default async function EmergencyDonationDetailRoute({ params }) {
  const { slug } = await params;
  const campaign = await getPublicEmergencyCampaignBySlug(slug);
  if (!campaign) notFound();

  return <EmergencyDonationDetailPage campaign={campaign} />;
}
