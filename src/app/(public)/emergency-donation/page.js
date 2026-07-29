import { getAllPublicEmergencyCampaigns } from "@/lib/api/public-emergency-campaign-service";
import { getPublicEmergencyCategories } from "@/lib/api/public-emergency-category-service";
import { EmergencyDonationHero } from "@/components/public/emergency-donation/emergency-donation-hero";
import { EmergencyDonationListPage } from "@/components/public/emergency-donation/emergency-donation-list-page";

export const metadata = {
  title: "Emergency Donation | Mir Faruk & Rima Foundation",
  description: "Support urgent emergency appeals — medical treatment, disaster relief and critical needs for those who need it most.",
};

export default async function PublicEmergencyDonationPage({ searchParams }) {
  const params = await searchParams;
  const initialCategoryId = Array.isArray(params?.categoryId)
    ? params.categoryId[0]
    : params?.categoryId ?? "";

  const [campaigns, categories] = await Promise.all([
    getAllPublicEmergencyCampaigns(),
    getPublicEmergencyCategories(),
  ]);
  return (
    <>
      <EmergencyDonationHero categories={categories} />
      <EmergencyDonationListPage
        campaigns={campaigns}
        categories={categories}
        initialCategoryId={initialCategoryId}
      />
    </>
  );
}
