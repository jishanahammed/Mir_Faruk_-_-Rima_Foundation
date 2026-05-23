"use client";

import { useEffect, useState } from "react";

const donorFormCopy = {
  en: {
    eyebrow: "Donor Account",
    title: "Donor Registration",
    closeLabel: "Close donor registration form",
    submitLabel: "Create Donor Account",
    successTitle: "Registration details received",
    successText:
      "Thank you. The donor account request is ready for review and profile completion after login.",
    fields: {
      fullName: "Full Name",
      email: "Email Address",
      mobile: "Mobile Number",
      address: "Address",
      profession: "Profession",
      donorType: "Donor Type",
      purpose: "Preferred Donation Purpose",
      frequency: "Donation Frequency",
      password: "Password",
      confirmPassword: "Confirm Password",
      terms: "I agree to the Terms & Conditions",
    },
    placeholders: {
      fullName: "Enter your full name",
      email: "name@example.com",
      mobile: "+880 1XXXXXXXXX",
      address: "Enter your address",
      profession: "Enter your profession",
      donorType: "Select donor type",
      purpose: "Select donation purpose",
      frequency: "Select frequency",
      password: "Create a secure password",
      confirmPassword: "Re-enter your password",
    },
    donorTypes: ["Individual", "Organization", "Company", "Overseas Donor"],
    purposes: [
      "General Fund",
      "Qard Hasanah Support",
      "Livestock Program",
      "Emergency Support",
      "Education Support",
    ],
    frequencies: ["One-time", "Monthly", "Yearly"],
  },
  bn: {
    eyebrow: "দাতা অ্যাকাউন্ট",
    title: "দাতা রেজিস্ট্রেশন",
    closeLabel: "দাতা রেজিস্ট্রেশন ফর্ম বন্ধ করুন",
    submitLabel: "দাতা অ্যাকাউন্ট তৈরি করুন",
    successTitle: "রেজিস্ট্রেশন তথ্য গ্রহণ করা হয়েছে",
    successText:
      "ধন্যবাদ। দাতা অ্যাকাউন্ট অনুরোধ রিভিউ এবং লগইনের পর প্রোফাইল সম্পন্ন করার জন্য প্রস্তুত।",
    fields: {
      fullName: "পূর্ণ নাম",
      email: "ইমেইল ঠিকানা",
      mobile: "মোবাইল নম্বর",
      address: "ঠিকানা",
      profession: "পেশা",
      donorType: "দাতার ধরন",
      purpose: "অনুদানের পছন্দের উদ্দেশ্য",
      frequency: "অনুদানের সময়কাল",
      password: "পাসওয়ার্ড",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      terms: "আমি শর্তাবলীতে সম্মত",
    },
    placeholders: {
      fullName: "আপনার পূর্ণ নাম লিখুন",
      email: "name@example.com",
      mobile: "+৮৮০ ১XXXXXXXXX",
      address: "আপনার ঠিকানা লিখুন",
      profession: "আপনার পেশা লিখুন",
      donorType: "দাতার ধরন নির্বাচন করুন",
      purpose: "অনুদানের উদ্দেশ্য নির্বাচন করুন",
      frequency: "সময়কাল নির্বাচন করুন",
      password: "নিরাপদ পাসওয়ার্ড দিন",
      confirmPassword: "পাসওয়ার্ড আবার লিখুন",
    },
    donorTypes: ["ব্যক্তিগত", "সংস্থা", "কোম্পানি", "প্রবাসী দাতা"],
    purposes: [
      "সাধারণ তহবিল",
      "করজে হাসানাহ সহায়তা",
      "গবাদিপশু কর্মসূচি",
      "জরুরি সহায়তা",
      "শিক্ষা সহায়তা",
    ],
    frequencies: ["এককালীন", "মাসিক", "বার্ষিক"],
  },
  da: {
    eyebrow: "Donorkonto",
    title: "Donorregistrering",
    closeLabel: "Luk donorregistreringsformular",
    submitLabel: "Opret Donorkonto",
    successTitle: "Registreringsoplysninger modtaget",
    successText:
      "Tak. Donorkontoanmodningen er klar til gennemgang og profiludfyldelse efter login.",
    fields: {
      fullName: "Fulde navn",
      email: "E-mailadresse",
      mobile: "Mobilnummer",
      address: "Adresse",
      profession: "Profession",
      donorType: "Donortype",
      purpose: "Foretrukket donationsformaal",
      frequency: "Donationshyppighed",
      password: "Adgangskode",
      confirmPassword: "Bekraeft adgangskode",
      terms: "Jeg accepterer vilkaar og betingelser",
    },
    placeholders: {
      fullName: "Indtast dit fulde navn",
      email: "name@example.com",
      mobile: "+45 XX XX XX XX",
      address: "Indtast din adresse",
      profession: "Indtast din profession",
      donorType: "Vaelg donortype",
      purpose: "Vaelg donationsformaal",
      frequency: "Vaelg hyppighed",
      password: "Opret en sikker adgangskode",
      confirmPassword: "Indtast adgangskoden igen",
    },
    donorTypes: ["Privatperson", "Organisation", "Virksomhed", "Udenlandsk donor"],
    purposes: [
      "Generel fond",
      "Qard Hasanah-stoette",
      "Husdyrprogram",
      "Akut stoette",
      "Uddannelsesstoette",
    ],
    frequencies: ["Engangs", "Maanedlig", "Aarlig"],
  },
};

const initialFormState = {
  fullName: "",
  email: "",
  mobile: "",
  address: "",
  profession: "",
  donorType: "",
  purpose: "",
  frequency: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const validationCopy = {
  en: {
    fullNameRequired: "Full name is required.",
    fullNameInvalid: "Enter a valid name without numbers.",
    emailRequired: "Email address is required.",
    emailInvalid: "Enter a valid email address.",
    mobileRequired: "Mobile number is required.",
    mobileInvalid: "Enter a valid mobile number.",
    addressRequired: "Address is required.",
    addressInvalid: "Address should be at least 8 characters.",
    passwordRequired: "Password is required.",
    passwordInvalid: "Use at least 8 characters with a letter and a number.",
    confirmPasswordRequired: "Confirm password is required.",
    confirmPasswordInvalid: "Password and confirm password do not match.",
    termsRequired: "Please agree to the Terms & Conditions.",
  },
  bn: {
    fullNameRequired: "পূর্ণ নাম প্রয়োজন।",
    fullNameInvalid: "সংখ্যা ছাড়া সঠিক নাম লিখুন।",
    emailRequired: "ইমেইল ঠিকানা প্রয়োজন।",
    emailInvalid: "সঠিক ইমেইল ঠিকানা লিখুন।",
    mobileRequired: "মোবাইল নম্বর প্রয়োজন।",
    mobileInvalid: "সঠিক মোবাইল নম্বর লিখুন।",
    addressRequired: "ঠিকানা প্রয়োজন।",
    addressInvalid: "ঠিকানা অন্তত ৮ অক্ষরের হতে হবে।",
    passwordRequired: "পাসওয়ার্ড প্রয়োজন।",
    passwordInvalid: "অন্তত ৮ অক্ষর, একটি অক্ষর ও একটি সংখ্যা ব্যবহার করুন।",
    confirmPasswordRequired: "কনফার্ম পাসওয়ার্ড প্রয়োজন।",
    confirmPasswordInvalid: "পাসওয়ার্ড মিলছে না।",
    termsRequired: "শর্তাবলীতে সম্মতি দিন।",
  },
  da: {
    fullNameRequired: "Fulde navn er paakraevet.",
    fullNameInvalid: "Indtast et gyldigt navn uden tal.",
    emailRequired: "E-mailadresse er paakraevet.",
    emailInvalid: "Indtast en gyldig e-mailadresse.",
    mobileRequired: "Mobilnummer er paakraevet.",
    mobileInvalid: "Indtast et gyldigt mobilnummer.",
    addressRequired: "Adresse er paakraevet.",
    addressInvalid: "Adressen skal vaere mindst 8 tegn.",
    passwordRequired: "Adgangskode er paakraevet.",
    passwordInvalid: "Brug mindst 8 tegn med et bogstav og et tal.",
    confirmPasswordRequired: "Bekraeft adgangskode er paakraevet.",
    confirmPasswordInvalid: "Adgangskoderne stemmer ikke overens.",
    termsRequired: "Accepter venligst vilkaar og betingelser.",
  },
};

function validateForm(form, language) {
  const messages = validationCopy[language] ?? validationCopy.en;
  const errors = {};
  const fullName = form.fullName.trim();
  const email = form.email.trim();
  const mobile = form.mobile.trim();
  const address = form.address.trim();
  const password = form.password;
  const confirmPassword = form.confirmPassword;

  if (!fullName) {
    errors.fullName = messages.fullNameRequired;
  } else if (fullName.length < 2 || /\d/.test(fullName) || !/[\p{L}]/u.test(fullName)) {
    errors.fullName = messages.fullNameInvalid;
  }

  if (!email) {
    errors.email = messages.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = messages.emailInvalid;
  }

  if (!mobile) {
    errors.mobile = messages.mobileRequired;
  } else {
    const digitCount = mobile.match(/\p{Nd}/gu)?.length ?? 0;

    if (!/^\+?[\p{Nd}\s\-()]+$/u.test(mobile) || digitCount < 7 || digitCount > 15) {
      errors.mobile = messages.mobileInvalid;
    }
  }

  if (!address) {
    errors.address = messages.addressRequired;
  } else if (address.length < 8) {
    errors.address = messages.addressInvalid;
  }

  if (!password) {
    errors.password = messages.passwordRequired;
  } else if (password.length < 8 || !/[\p{L}]/u.test(password) || !/[\p{Nd}]/u.test(password)) {
    errors.password = messages.passwordInvalid;
  }

  if (!confirmPassword) {
    errors.confirmPassword = messages.confirmPasswordRequired;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = messages.confirmPasswordInvalid;
  }

  if (!form.terms) {
    errors.terms = messages.termsRequired;
  }

  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
      {label}
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="mt-2 block text-xs font-semibold leading-5 text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function inputClass(hasError = false) {
  const stateClass = hasError
    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
    : "border-slate-200 bg-white focus:border-cyan-400 focus:ring-cyan-100";

  return `h-12 w-full rounded-xl border px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${stateClass}`;
}

export function DonorRegistrationModal({ isOpen, language, onClose }) {
  const copy = donorFormCopy[language] ?? donorFormCopy.en;
  const [form, setForm] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;

    setValidationErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
    setIsSubmitted(false);

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, language);

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      setIsSubmitted(false);
      return;
    }

    setValidationErrors({});
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donor-registration-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={copy.closeLabel}
        onClick={onClose}
      />

      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/30">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-[linear-gradient(135deg,_#f8fafc,_#ecfeff)] px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-cyan-700 uppercase">
              {copy.eyebrow}
            </p>
            <h2
              id="donor-registration-title"
              className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl"
            >
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            aria-label={copy.closeLabel}
            onClick={onClose}
          >
            x
          </button>
        </div>

        <form
          className="max-h-[calc(92vh-9.5rem)] overflow-y-auto px-5 py-6 sm:px-7"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="donor-full-name"
              label={copy.fields.fullName}
              error={validationErrors.fullName}
            >
              <input
                id="donor-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={form.fullName}
                onChange={updateField("fullName")}
                placeholder={copy.placeholders.fullName}
                className={inputClass(Boolean(validationErrors.fullName))}
              />
            </Field>

            <Field
              id="donor-email"
              label={copy.fields.email}
              error={validationErrors.email}
            >
              <input
                id="donor-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={updateField("email")}
                placeholder={copy.placeholders.email}
                className={inputClass(Boolean(validationErrors.email))}
              />
            </Field>

            <Field
              id="donor-mobile"
              label={copy.fields.mobile}
              error={validationErrors.mobile}
            >
              <input
                id="donor-mobile"
                name="mobile"
                type="tel"
                autoComplete="tel"
                required
                value={form.mobile}
                onChange={updateField("mobile")}
                placeholder={copy.placeholders.mobile}
                className={inputClass(Boolean(validationErrors.mobile))}
              />
            </Field>

            <Field
              id="donor-address"
              label={copy.fields.address}
              error={validationErrors.address}
            >
              <input
                id="donor-address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                value={form.address}
                onChange={updateField("address")}
                placeholder={copy.placeholders.address}
                className={inputClass(Boolean(validationErrors.address))}
              />
            </Field>

            <Field
              id="donor-profession"
              label={copy.fields.profession}
              error={validationErrors.profession}
            >
              <input
                id="donor-profession"
                name="profession"
                type="text"
                autoComplete="organization-title"
                value={form.profession}
                onChange={updateField("profession")}
                placeholder={copy.placeholders.profession}
                className={inputClass(Boolean(validationErrors.profession))}
              />
            </Field>

            <Field
              id="donor-type"
              label={copy.fields.donorType}
              error={validationErrors.donorType}
            >
              <select
                id="donor-type"
                name="donorType"
                value={form.donorType}
                onChange={updateField("donorType")}
                className={inputClass(Boolean(validationErrors.donorType))}
              >
                <option value="">{copy.placeholders.donorType}</option>
                {copy.donorTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="donor-purpose"
              label={copy.fields.purpose}
              error={validationErrors.purpose}
            >
              <select
                id="donor-purpose"
                name="purpose"
                value={form.purpose}
                onChange={updateField("purpose")}
                className={inputClass(Boolean(validationErrors.purpose))}
              >
                <option value="">{copy.placeholders.purpose}</option>
                {copy.purposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="donor-frequency"
              label={copy.fields.frequency}
              error={validationErrors.frequency}
            >
              <select
                id="donor-frequency"
                name="frequency"
                value={form.frequency}
                onChange={updateField("frequency")}
                className={inputClass(Boolean(validationErrors.frequency))}
              >
                <option value="">{copy.placeholders.frequency}</option>
                {copy.frequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="donor-password"
              label={copy.fields.password}
              error={validationErrors.password}
            >
              <input
                id="donor-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.password}
                onChange={updateField("password")}
                placeholder={copy.placeholders.password}
                className={inputClass(Boolean(validationErrors.password))}
              />
            </Field>

            <Field
              id="donor-confirm-password"
              label={copy.fields.confirmPassword}
              error={validationErrors.confirmPassword}
            >
              <input
                id="donor-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                placeholder={copy.placeholders.confirmPassword}
                className={inputClass(Boolean(validationErrors.confirmPassword))}
              />
            </Field>
          </div>

          <label
            className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 ${
              validationErrors.terms
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <input
              name="terms"
              type="checkbox"
              required
              checked={form.terms}
              onChange={updateField("terms")}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-700 accent-cyan-700"
            />
            <span>{copy.fields.terms}</span>
          </label>
          {validationErrors.terms ? (
            <p className="mt-2 text-xs font-semibold leading-5 text-red-600">
              {validationErrors.terms}
            </p>
          ) : null}

          {isSubmitted ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              <strong className="block font-semibold">{copy.successTitle}</strong>
              {copy.successText}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
            >
              {language === "bn" ? "বন্ধ করুন" : "Close"}
            </button>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
            >
              {copy.submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
