import { BeneficiaryRegistrationForm } from "@/components/public/home/beneficiary-registration-form";
import { LocaleProvider } from "@/components/public/providers/locale-provider";

export const metadata = {
  title: "Beneficiary Registration | Volunteer Portal",
};

export default function VolunteerBeneficiaryRegistrationPage() {
  return (
    <LocaleProvider>
      <BeneficiaryRegistrationForm embedded />
    </LocaleProvider>
  );
}
