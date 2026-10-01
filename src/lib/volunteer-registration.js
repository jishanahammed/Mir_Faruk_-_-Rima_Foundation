export function volunteerPayload(input = {}) {
  return {
    name: String(input.name ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    email: String(input.email ?? "").trim(),
    profession: String(input.profession ?? "").trim(),
    ...Object.fromEntries(["divisionId", "districtId", "upazilaId", "localGovernmentId", "wardId"]
      .map((key) => [key, Number(input[key]) || 0])),
  };
}

export function volunteerErrorMessage(error) {
  const errors = error?.details?.errors;
  return (errors && Object.values(errors).flat().find(Boolean))
    || error?.message || "Unable to save the volunteer. Please try again.";
}

export const volunteerCopy = {
  EN: {
    title: "Become a volunteer", intro: "Share your time and skills to help families build a better future.",
    personal: "Your details", location: "Where you can help", name: "Full name", phone: "Mobile number",
    email: "Email address", profession: "Profession", divisionId: "Division", districtId: "District",
    upazilaId: "Upazila", localGovernmentId: "Union / Pourashava", wardId: "Ward",
    choose: "Select", loading: "Loading…", empty: "No locations available. Please contact the foundation.",
    loadError: "Unable to load locations.", retry: "Try again", submit: "Submit registration", saving: "Saving…",
    note: "All fields are required. Our team will contact you after reviewing your application.",
    phoneHint: "Use 01XXXXXXXXX or +8801XXXXXXXXX.", success: "Thank you for volunteering!",
    received: "Your registration has been received and is awaiting approval. Our team will contact you using the details you provided.",
    another: "Register another volunteer", back: "Back to registration options", save: "Save changes", cancel: "Cancel",
  },
  BN: {
    title: "স্বেচ্ছাসেবক হিসেবে যোগ দিন", intro: "আপনার সময় ও দক্ষতা দিয়ে পরিবারের সুন্দর ভবিষ্যৎ গড়তে সাহায্য করুন।",
    personal: "আপনার তথ্য", location: "আপনার কর্মস্থল এলাকা", name: "পূর্ণ নাম", phone: "মোবাইল নম্বর",
    email: "ইমেইল ঠিকানা", profession: "পেশা", divisionId: "বিভাগ", districtId: "জেলা",
    upazilaId: "উপজেলা", localGovernmentId: "ইউনিয়ন / পৌরসভা", wardId: "ওয়ার্ড",
    choose: "নির্বাচন করুন", loading: "লোড হচ্ছে…", empty: "কোনো এলাকা পাওয়া যায়নি। ফাউন্ডেশনে যোগাযোগ করুন।",
    loadError: "এলাকার তথ্য লোড করা যায়নি।", retry: "আবার চেষ্টা করুন", submit: "নিবন্ধন জমা দিন", saving: "সংরক্ষণ হচ্ছে…",
    note: "সব তথ্য পূরণ করুন। আবেদন পর্যালোচনার পর আমাদের দল আপনার সাথে যোগাযোগ করবে।",
    phoneHint: "01XXXXXXXXX অথবা +8801XXXXXXXXX ব্যবহার করুন।", success: "স্বেচ্ছাসেবক হিসেবে যোগ দেওয়ার জন্য ধন্যবাদ!",
    received: "আপনার নিবন্ধন গ্রহণ করা হয়েছে এবং অনুমোদনের অপেক্ষায় রয়েছে। আপনার দেওয়া তথ্য অনুযায়ী আমরা যোগাযোগ করব।",
    another: "আরেকজন স্বেচ্ছাসেবক নিবন্ধন করুন", back: "নিবন্ধনের বিকল্পগুলো দেখুন", save: "পরিবর্তন সংরক্ষণ করুন", cancel: "বাতিল",
  },
  DK: {
    title: "Bliv frivillig", intro: "Brug din tid og dine færdigheder til at hjælpe familier med at skabe en bedre fremtid.",
    personal: "Dine oplysninger", location: "Hvor du kan hjælpe", name: "Fulde navn", phone: "Mobilnummer",
    email: "E-mailadresse", profession: "Erhverv", divisionId: "Division", districtId: "Distrikt",
    upazilaId: "Upazila", localGovernmentId: "Union / Pourashava", wardId: "Ward",
    choose: "Vælg", loading: "Indlæser…", empty: "Ingen områder tilgængelige. Kontakt venligst fonden.",
    loadError: "Områderne kunne ikke indlæses.", retry: "Prøv igen", submit: "Send tilmelding", saving: "Gemmer…",
    note: "Alle felter er obligatoriske. Vores team kontakter dig efter gennemgang af din ansøgning.",
    phoneHint: "Brug 01XXXXXXXXX eller +8801XXXXXXXXX.", success: "Tak for din tilmelding!",
    received: "Din tilmelding er modtaget og afventer godkendelse. Vores team kontakter dig via de angivne oplysninger.",
    another: "Tilmeld en anden frivillig", back: "Tilbage til tilmeldingsmuligheder", save: "Gem ændringer", cancel: "Annuller",
  },
};
