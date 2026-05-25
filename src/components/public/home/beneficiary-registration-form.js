"use client";

import { useMemo, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";

const stepKeys = ["basic", "assistance", "guarantor", "documents"];

const beneficiaryFormCopy = {
  en: {
    eyebrow: "Beneficiary Account",
    title: "Beneficiary Registration",
    description:
      "For Bangladeshi citizens who need ethical, transparent, and self-reliance-focused assistance.",
    stepLabel: "Step",
    ofLabel: "of",
    selectPrefix: "Select",
    optionalLabel: "Optional",
    selectedLabel: "Selected:",
    backToRegistration: "Back to Registration",
    back: "Back",
    continue: "Save & Continue",
    submit: "Submit Registration",
    successTitle: "Registration details received",
    successText: "Thank you. The beneficiary registration request is ready for review.",
    requiredMessage: "is required.",
    checkboxMessage: "Please confirm this item.",
    emailMessage: "Enter a valid email address.",
    mobileMessage: "Enter a valid mobile number.",
    passwordMessage: "Use at least 8 characters with a letter and a number.",
    confirmPasswordMessage: "Password and confirm password do not match.",
    steps: {
      basic: {
        title: "Basic Information",
        helper: "Applicant identity, address, and family details",
      },
      assistance: {
        title: "Assistance Request",
        helper: "Need, purpose, income, and commitment",
      },
      guarantor: {
        title: "Guarantor",
        helper: "Trusted person who confirms the applicant",
      },
      documents: {
        title: "Documents & Agreement",
        helper: "Required files, account, and confirmation",
      },
    },
    labels: {
      fullName: "Full Name",
      fatherOrHusbandName: "Father's / Husband's Name",
      motherName: "Mother's Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      nidOrBirthNumber: "NID / Birth Certificate Number",
      mobile: "Mobile Number",
      email: "Email Address",
      presentAddress: "Present Address",
      permanentAddress: "Permanent Address",
      district: "District",
      upazila: "Upazila / Thana",
      unionWard: "Union / Ward",
      villageArea: "Village / Area",
      maritalStatus: "Marital Status",
      familyMembers: "Number of Family Members",
      monthlyIncome: "Monthly Family Income",
      mainOccupation: "Main Occupation",
      financialCondition: "Current Financial Condition",
      assistanceReason: "Reason for Assistance Request",
      assistanceType: "Type of Assistance Needed",
      expectedAssistance: "Expected Assistance Amount / Asset",
      assistancePurpose: "Purpose of Assistance",
      repaymentCommitment:
        "I agree to return/pass equivalent benefit according to foundation policy",
      guarantorName: "Guarantor Full Name",
      guarantorFatherOrHusbandName: "Father's / Husband's Name",
      guarantorNid: "NID Number",
      guarantorMobile: "Mobile Number",
      guarantorEmail: "Email Address",
      guarantorOccupation: "Occupation",
      guarantorRelation: "Relationship with Beneficiary",
      guarantorPresentAddress: "Present Address",
      guarantorPermanentAddress: "Permanent Address",
      guarantorDistrict: "District",
      guarantorUpazila: "Upazila / Thana",
      knownDuration: "How long do you know the beneficiary?",
      confirmsInfo: "Do you confirm the beneficiary's information is correct?",
      supportsVerification: "Are you willing to support verification if needed?",
      guarantorComment: "Guarantor Statement / Comment",
      applicantNidCopy: "NID / Birth Certificate Copy",
      applicantPhoto: "Photo of Applicant",
      addressProof: "Address Proof",
      incomeCertificate: "Income / Poverty Certificate",
      recommendationLetter: "Recommendation Letter",
      guarantorNidCopy: "Guarantor NID Copy",
      guarantorPhoto: "Guarantor Photo",
      password: "Password",
      confirmPassword: "Confirm Password",
      terms: "I agree to the Terms & Conditions",
      truthConfirmed: "I confirm that the provided information is true",
      guarantorKnownConfirmed: "I confirm that I know the beneficiary personally",
      guarantorCooperationConfirmed:
        "I agree to cooperate with the foundation for verification",
      digitalSignature: "Digital signature / confirmation checkbox",
    },
    hints: {
      expectedAssistance: "Example: 2 goats, small business fund, emergency support amount",
      assistancePurpose: "Write how this support will help the family become self-reliant.",
      knownDuration: "Example: 5 years",
      guarantorComment: "Optional",
      addressProof: "Optional",
      incomeCertificate: "Optional",
      recommendationLetter: "Optional",
      guarantorPhoto: "Optional",
    },
    options: {
      gender: ["Male", "Female", "Other"],
      maritalStatus: ["Single", "Married", "Widowed", "Divorced"],
      financialCondition: ["Very poor", "Low income", "Emergency hardship", "Temporary crisis"],
      assistanceType: [
        "Qard Hasanah",
        "Livestock Support",
        "Small Business Support",
        "Emergency Support",
      ],
      confirmsInfo: ["Yes", "No"],
      supportsVerification: ["Yes", "No"],
    },
  },
  bn: {
    eyebrow: "সহায়তা গ্রহণকারী অ্যাকাউন্ট",
    title: "সহায়তা গ্রহণকারী রেজিস্ট্রেশন",
    description:
      "নৈতিক, স্বচ্ছ এবং আত্মনির্ভরশীলতা-কেন্দ্রিক সহায়তা প্রয়োজন এমন বাংলাদেশি নাগরিকদের জন্য।",
    stepLabel: "ধাপ",
    ofLabel: "এর মধ্যে",
    selectPrefix: "নির্বাচন করুন",
    optionalLabel: "ঐচ্ছিক",
    selectedLabel: "নির্বাচিত:",
    backToRegistration: "রেজিস্ট্রেশনে ফিরে যান",
    back: "পেছনে",
    continue: "সংরক্ষণ করে এগিয়ে যান",
    submit: "রেজিস্ট্রেশন জমা দিন",
    successTitle: "রেজিস্ট্রেশন তথ্য গ্রহণ করা হয়েছে",
    successText: "ধন্যবাদ। সহায়তা গ্রহণকারী রেজিস্ট্রেশন অনুরোধ রিভিউয়ের জন্য প্রস্তুত।",
    requiredMessage: "প্রয়োজন।",
    checkboxMessage: "অনুগ্রহ করে নিশ্চিত করুন।",
    emailMessage: "সঠিক ইমেইল ঠিকানা লিখুন।",
    mobileMessage: "সঠিক মোবাইল নম্বর লিখুন।",
    passwordMessage: "অন্তত ৮ অক্ষর, একটি অক্ষর ও একটি সংখ্যা ব্যবহার করুন।",
    confirmPasswordMessage: "পাসওয়ার্ড মিলছে না।",
    steps: {
      basic: {
        title: "মৌলিক তথ্য",
        helper: "আবেদনকারীর পরিচয়, ঠিকানা এবং পরিবারের তথ্য",
      },
      assistance: {
        title: "সহায়তার আবেদন",
        helper: "সহায়তার ধরন, কারণ, আয় এবং অঙ্গীকার",
      },
      guarantor: {
        title: "জামিনদারের তথ্য",
        helper: "আবেদনকারীকে নিশ্চিত করেন এমন বিশ্বস্ত ব্যক্তি",
      },
      documents: {
        title: "ডকুমেন্ট ও সম্মতি",
        helper: "প্রয়োজনীয় ফাইল, অ্যাকাউন্ট এবং নিশ্চিতকরণ",
      },
    },
    labels: {
      fullName: "পূর্ণ নাম",
      fatherOrHusbandName: "পিতা / স্বামীর নাম",
      motherName: "মাতার নাম",
      dateOfBirth: "জন্ম তারিখ",
      gender: "লিঙ্গ",
      nidOrBirthNumber: "এনআইডি / জন্ম নিবন্ধন নম্বর",
      mobile: "মোবাইল নম্বর",
      email: "ইমেইল ঠিকানা",
      presentAddress: "বর্তমান ঠিকানা",
      permanentAddress: "স্থায়ী ঠিকানা",
      district: "জেলা",
      upazila: "উপজেলা / থানা",
      unionWard: "ইউনিয়ন / ওয়ার্ড",
      villageArea: "গ্রাম / এলাকা",
      maritalStatus: "বৈবাহিক অবস্থা",
      familyMembers: "পরিবারের সদস্য সংখ্যা",
      monthlyIncome: "পরিবারের মাসিক আয়",
      mainOccupation: "প্রধান পেশা",
      financialCondition: "বর্তমান আর্থিক অবস্থা",
      assistanceReason: "সহায়তার আবেদনের কারণ",
      assistanceType: "প্রয়োজনীয় সহায়তার ধরন",
      expectedAssistance: "প্রত্যাশিত সহায়তার পরিমাণ / সম্পদ",
      assistancePurpose: "সহায়তার উদ্দেশ্য",
      repaymentCommitment:
        "ফাউন্ডেশন নীতিমালা অনুযায়ী সমমানের সুবিধা ফেরত/হস্তান্তরে আমি সম্মত",
      guarantorName: "জামিনদারের পূর্ণ নাম",
      guarantorFatherOrHusbandName: "পিতা / স্বামীর নাম",
      guarantorNid: "এনআইডি নম্বর",
      guarantorMobile: "মোবাইল নম্বর",
      guarantorEmail: "ইমেইল ঠিকানা",
      guarantorOccupation: "পেশা",
      guarantorRelation: "সহায়তা গ্রহণকারীর সাথে সম্পর্ক",
      guarantorPresentAddress: "বর্তমান ঠিকানা",
      guarantorPermanentAddress: "স্থায়ী ঠিকানা",
      guarantorDistrict: "জেলা",
      guarantorUpazila: "উপজেলা / থানা",
      knownDuration: "আপনি কতদিন ধরে সহায়তা গ্রহণকারীকে চেনেন?",
      confirmsInfo: "আপনি কি সহায়তা গ্রহণকারীর তথ্য সঠিক বলে নিশ্চিত করেন?",
      supportsVerification: "প্রয়োজনে যাচাইয়ে সহযোগিতা করতে রাজি আছেন?",
      guarantorComment: "জামিনদারের মন্তব্য",
      applicantNidCopy: "এনআইডি / জন্ম নিবন্ধন কপি",
      applicantPhoto: "আবেদনকারীর ছবি",
      addressProof: "ঠিকানার প্রমাণ",
      incomeCertificate: "আয় / দারিদ্র্য সনদ",
      recommendationLetter: "সুপারিশপত্র",
      guarantorNidCopy: "জামিনদারের এনআইডি কপি",
      guarantorPhoto: "জামিনদারের ছবি",
      password: "পাসওয়ার্ড",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      terms: "আমি শর্তাবলীতে সম্মত",
      truthConfirmed: "আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সত্য",
      guarantorKnownConfirmed: "আমি নিশ্চিত করছি যে আমি সহায়তা গ্রহণকারীকে ব্যক্তিগতভাবে চিনি",
      guarantorCooperationConfirmed:
        "যাচাইয়ের জন্য ফাউন্ডেশনের সাথে সহযোগিতা করতে আমি সম্মত",
      digitalSignature: "ডিজিটাল স্বাক্ষর / নিশ্চিতকরণ চেকবক্স",
    },
    hints: {
      expectedAssistance: "যেমন: ২টি ছাগল, ছোট ব্যবসার তহবিল, জরুরি সহায়তার পরিমাণ",
      assistancePurpose: "এই সহায়তা কীভাবে পরিবারকে আত্মনির্ভর করতে সাহায্য করবে লিখুন।",
      knownDuration: "যেমন: ৫ বছর",
      guarantorComment: "ঐচ্ছিক",
      addressProof: "ঐচ্ছিক",
      incomeCertificate: "ঐচ্ছিক",
      recommendationLetter: "ঐচ্ছিক",
      guarantorPhoto: "ঐচ্ছিক",
    },
    options: {
      gender: ["পুরুষ", "নারী", "অন্যান্য"],
      maritalStatus: ["অবিবাহিত", "বিবাহিত", "বিধবা/বিপত্নীক", "তালাকপ্রাপ্ত"],
      financialCondition: ["অত্যন্ত দরিদ্র", "স্বল্প আয়", "জরুরি সংকট", "সাময়িক সংকট"],
      assistanceType: ["করজে হাসানাহ", "গবাদিপশু সহায়তা", "ছোট ব্যবসা সহায়তা", "জরুরি সহায়তা"],
      confirmsInfo: ["হ্যাঁ", "না"],
      supportsVerification: ["হ্যাঁ", "না"],
    },
  },
  da: {
    eyebrow: "Modtagerkonto",
    title: "Modtagerregistrering",
    description:
      "For bangladeshiske borgere, der har brug for etisk, transparent og selvforsyningsfokuseret stoette.",
    stepLabel: "Trin",
    ofLabel: "af",
    selectPrefix: "Vaelg",
    optionalLabel: "Valgfrit",
    selectedLabel: "Valgt:",
    backToRegistration: "Tilbage til registrering",
    back: "Tilbage",
    continue: "Gem og fortsaet",
    submit: "Indsend registrering",
    successTitle: "Registreringsoplysninger modtaget",
    successText: "Tak. Modtagerregistreringen er klar til gennemgang.",
    requiredMessage: "er paakraevet.",
    checkboxMessage: "Bekraeft venligst dette punkt.",
    emailMessage: "Indtast en gyldig e-mailadresse.",
    mobileMessage: "Indtast et gyldigt mobilnummer.",
    passwordMessage: "Brug mindst 8 tegn med et bogstav og et tal.",
    confirmPasswordMessage: "Adgangskoderne stemmer ikke overens.",
    steps: {
      basic: {
        title: "Grundoplysninger",
        helper: "Ansogerens identitet, adresse og familieoplysninger",
      },
      assistance: {
        title: "Stoetteanmodning",
        helper: "Behov, formaal, indkomst og forpligtelse",
      },
      guarantor: {
        title: "Garant",
        helper: "En betroet person, der bekraefter ansogeren",
      },
      documents: {
        title: "Dokumenter & aftale",
        helper: "Paakraevede filer, konto og bekraeftelse",
      },
    },
    labels: {
      fullName: "Fulde navn",
      fatherOrHusbandName: "Fars / aegtefaelles navn",
      motherName: "Mors navn",
      dateOfBirth: "Fodselsdato",
      gender: "Kon",
      nidOrBirthNumber: "NID / fodselsattestnummer",
      mobile: "Mobilnummer",
      email: "E-mailadresse",
      presentAddress: "Nuvaerende adresse",
      permanentAddress: "Permanent adresse",
      district: "Distrikt",
      upazila: "Upazila / Thana",
      unionWard: "Union / Ward",
      villageArea: "Landsby / omraade",
      maritalStatus: "Civilstand",
      familyMembers: "Antal familiemedlemmer",
      monthlyIncome: "Familiens maanedlige indkomst",
      mainOccupation: "Primaer beskaeftigelse",
      financialCondition: "Nuvaerende okonomisk situation",
      assistanceReason: "Aarsag til stoetteanmodning",
      assistanceType: "Type stoette der behoves",
      expectedAssistance: "Forventet stoettebelob / aktiv",
      assistancePurpose: "Formaal med stoette",
      repaymentCommitment:
        "Jeg accepterer at returnere/videregive tilsvarende fordel efter fondens politik",
      guarantorName: "Garantens fulde navn",
      guarantorFatherOrHusbandName: "Fars / aegtefaelles navn",
      guarantorNid: "NID-nummer",
      guarantorMobile: "Mobilnummer",
      guarantorEmail: "E-mailadresse",
      guarantorOccupation: "Beskaeftigelse",
      guarantorRelation: "Relation til modtager",
      guarantorPresentAddress: "Nuvaerende adresse",
      guarantorPermanentAddress: "Permanent adresse",
      guarantorDistrict: "Distrikt",
      guarantorUpazila: "Upazila / Thana",
      knownDuration: "Hvor laenge har du kendt modtageren?",
      confirmsInfo: "Bekraefter du, at modtagerens oplysninger er korrekte?",
      supportsVerification: "Vil du hjaelpe med verifikation hvis nodvendigt?",
      guarantorComment: "Garantens kommentar",
      applicantNidCopy: "NID / fodselsattest kopi",
      applicantPhoto: "Foto af ansoger",
      addressProof: "Adressebevis",
      incomeCertificate: "Indkomst / fattigdomscertifikat",
      recommendationLetter: "Anbefalingsbrev",
      guarantorNidCopy: "Garantens NID-kopi",
      guarantorPhoto: "Garantens foto",
      password: "Adgangskode",
      confirmPassword: "Bekraeft adgangskode",
      terms: "Jeg accepterer vilkaar og betingelser",
      truthConfirmed: "Jeg bekraefter, at oplysningerne er sande",
      guarantorKnownConfirmed: "Jeg bekraefter, at jeg kender modtageren personligt",
      guarantorCooperationConfirmed: "Jeg accepterer at samarbejde med fonden om verifikation",
      digitalSignature: "Digital signatur / bekraeftelsesfelt",
    },
    hints: {
      expectedAssistance: "Eksempel: 2 geder, lille virksomhedsstoette, akut stoettebelob",
      assistancePurpose: "Skriv hvordan stoetten hjaelper familien mod selvforsorgelse.",
      knownDuration: "Eksempel: 5 aar",
      guarantorComment: "Valgfrit",
      addressProof: "Valgfrit",
      incomeCertificate: "Valgfrit",
      recommendationLetter: "Valgfrit",
      guarantorPhoto: "Valgfrit",
    },
    options: {
      gender: ["Mand", "Kvinde", "Andet"],
      maritalStatus: ["Single", "Gift", "Enke/enkemand", "Skilt"],
      financialCondition: ["Meget fattig", "Lav indkomst", "Akut krise", "Midlertidig krise"],
      assistanceType: ["Qard Hasanah", "Husdyrstoette", "Lille virksomhed stoette", "Akut stoette"],
      confirmsInfo: ["Ja", "Nej"],
      supportsVerification: ["Ja", "Nej"],
    },
  },
};

const initialFormState = {
  fullName: "",
  fatherOrHusbandName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  nidOrBirthNumber: "",
  mobile: "",
  email: "",
  presentAddress: "",
  permanentAddress: "",
  district: "",
  upazila: "",
  unionWard: "",
  villageArea: "",
  maritalStatus: "",
  familyMembers: "",
  monthlyIncome: "",
  mainOccupation: "",
  financialCondition: "",
  assistanceReason: "",
  assistanceType: "",
  expectedAssistance: "",
  assistancePurpose: "",
  repaymentCommitment: false,
  guarantorName: "",
  guarantorFatherOrHusbandName: "",
  guarantorNid: "",
  guarantorMobile: "",
  guarantorEmail: "",
  guarantorOccupation: "",
  guarantorRelation: "",
  guarantorPresentAddress: "",
  guarantorPermanentAddress: "",
  guarantorDistrict: "",
  guarantorUpazila: "",
  knownDuration: "",
  confirmsInfo: "",
  supportsVerification: "",
  guarantorComment: "",
  applicantNidCopy: null,
  applicantPhoto: null,
  addressProof: null,
  incomeCertificate: null,
  recommendationLetter: null,
  guarantorNidCopy: null,
  guarantorPhoto: null,
  password: "",
  confirmPassword: "",
  terms: false,
  truthConfirmed: false,
  guarantorKnownConfirmed: false,
  guarantorCooperationConfirmed: false,
  digitalSignature: false,
};

const requiredByStep = {
  0: [
    "fullName",
    "fatherOrHusbandName",
    "motherName",
    "dateOfBirth",
    "gender",
    "nidOrBirthNumber",
    "mobile",
    "presentAddress",
    "permanentAddress",
    "district",
    "upazila",
    "unionWard",
    "villageArea",
    "maritalStatus",
    "familyMembers",
  ],
  1: [
    "monthlyIncome",
    "mainOccupation",
    "financialCondition",
    "assistanceReason",
    "assistanceType",
    "expectedAssistance",
    "assistancePurpose",
    "repaymentCommitment",
  ],
  2: [
    "guarantorName",
    "guarantorFatherOrHusbandName",
    "guarantorNid",
    "guarantorMobile",
    "guarantorOccupation",
    "guarantorRelation",
    "guarantorPresentAddress",
    "guarantorPermanentAddress",
    "guarantorDistrict",
    "guarantorUpazila",
    "knownDuration",
    "confirmsInfo",
    "supportsVerification",
  ],
  3: [
    "applicantNidCopy",
    "applicantPhoto",
    "guarantorNidCopy",
    "password",
    "confirmPassword",
    "terms",
    "truthConfirmed",
    "guarantorKnownConfirmed",
    "guarantorCooperationConfirmed",
    "digitalSignature",
  ],
};

function inputClass(hasError = false) {
  const stateClass = hasError
    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100"
    : "border-slate-200 bg-white focus:border-cyan-400 focus:ring-cyan-100";

  return `h-12 w-full rounded-xl border px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${stateClass}`;
}

function textAreaClass(hasError = false) {
  return inputClass(hasError).replace("h-12", "min-h-24 py-3");
}

function getFileName(file) {
  return file?.name ?? "";
}

function Field({ id, label, error, hint, children }) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
      <span className="flex items-center gap-2">
        {label}
        {hint ? <span className="text-xs font-medium text-slate-400">{hint}</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="mt-2 block text-xs font-semibold leading-5 text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextInput({
  id,
  form,
  errors,
  onChange,
  text,
  type = "text",
  autoComplete,
  placeholder,
}) {
  return (
    <Field id={id} label={text.labels[id]} error={errors[id]} hint={text.hints[id]}>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={form[id]}
        onChange={onChange(id)}
        placeholder={placeholder ?? text.labels[id]}
        className={inputClass(Boolean(errors[id]))}
      />
    </Field>
  );
}

function TextArea({ id, form, errors, onChange, text, placeholder }) {
  return (
    <Field id={id} label={text.labels[id]} error={errors[id]} hint={text.hints[id]}>
      <textarea
        id={id}
        name={id}
        value={form[id]}
        onChange={onChange(id)}
        placeholder={placeholder ?? text.labels[id]}
        className={textAreaClass(Boolean(errors[id]))}
      />
    </Field>
  );
}

function SelectInput({ id, form, errors, onChange, text }) {
  return (
    <Field id={id} label={text.labels[id]} error={errors[id]}>
      <select
        id={id}
        name={id}
        value={form[id]}
        onChange={onChange(id)}
        className={inputClass(Boolean(errors[id]))}
      >
        <option value="">
          {text.selectPrefix} {text.labels[id]}
        </option>
        {text.options[id].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CheckboxField({ id, form, errors, onChange, text }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold leading-6 ${
        errors[id]
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <input
        name={id}
        type="checkbox"
        checked={form[id]}
        onChange={onChange(id)}
        className="mt-1 h-4 w-4 rounded border-slate-300 accent-cyan-700"
      />
      <span>
        {text.labels[id]}
        {errors[id] ? (
          <span className="mt-1 block text-xs font-semibold text-red-600">{errors[id]}</span>
        ) : null}
      </span>
    </label>
  );
}

function FileInput({ id, form, errors, onChange, text }) {
  return (
    <Field id={id} label={text.labels[id]} error={errors[id]} hint={text.hints[id]}>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/*,.pdf"
        onChange={onChange(id)}
        className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-700"
      />
      {getFileName(form[id]) ? (
        <span className="mt-2 block text-xs font-semibold text-cyan-700">
          {text.selectedLabel} {getFileName(form[id])}
        </span>
      ) : null}
    </Field>
  );
}

function validateStep(form, stepIndex, text) {
  const errors = {};

  requiredByStep[stepIndex].forEach((field) => {
    if (typeof form[field] === "boolean") {
      if (!form[field]) {
        errors[field] = text.checkboxMessage;
      }
      return;
    }

    if (!form[field] || (typeof form[field] === "string" && !form[field].trim())) {
      errors[field] = `${text.labels[field]} ${text.requiredMessage}`;
    }
  });

  const emailFields = ["email", "guarantorEmail"];
  emailFields.forEach((field) => {
    if (form[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[field].trim())) {
      errors[field] = text.emailMessage;
    }
  });

  const phoneFields = ["mobile", "guarantorMobile"];
  phoneFields.forEach((field) => {
    if (form[field]) {
      const digitCount = form[field].match(/\p{Nd}/gu)?.length ?? 0;

      if (!/^\+?[\p{Nd}\s\-()]+$/u.test(form[field]) || digitCount < 7 || digitCount > 15) {
        errors[field] = text.mobileMessage;
      }
    }
  });

  if (stepIndex === 3) {
    if (form.password && (form.password.length < 8 || !/[\p{L}]/u.test(form.password) || !/[\p{Nd}]/u.test(form.password))) {
      errors.password = text.passwordMessage;
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      errors.confirmPassword = text.confirmPasswordMessage;
    }
  }

  return errors;
}

export function BeneficiaryRegistrationForm() {
  const { copy: siteCopy } = useSiteLocale();
  const text = beneficiaryFormCopy[siteCopy.htmlLang] ?? beneficiaryFormCopy.en;
  const steps = stepKeys.map((key) => ({
    id: key,
    ...text.steps[key],
  }));
  const [form, setForm] = useState(initialFormState);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

  const updateField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.type === "file"
          ? event.target.files?.[0] ?? null
          : event.target.value;

    setErrors((current) => {
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
  const fieldProps = { form, errors, onChange: updateField, text };

  const validateCurrentStep = () => {
    const nextErrors = validateStep(form, activeStep, text);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <section className="bg-slate-50 px-6 py-16 lg:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,_#f8fafc,_#ecfeff)] px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-cyan-700 uppercase">
              {text.eyebrow}
            </p>
            <h1
              id="beneficiary-registration-title"
              className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl"
            >
              {text.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {text.description}
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                {text.stepLabel} {activeStep + 1} {text.ofLabel} {steps.length}
              </span>
              <span>{steps[activeStep].title}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={`rounded-2xl border px-3 py-3 text-left transition ${
                    index === activeStep
                      ? "border-cyan-200 bg-white text-cyan-800 shadow-sm"
                      : "border-transparent bg-white/50 text-slate-500"
                  }`}
                  onClick={() => {
                    if (index <= activeStep || validateCurrentStep()) {
                      setActiveStep(index);
                    }
                  }}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.16em]">
                    {text.stepLabel} {index + 1}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          className="px-5 py-6 sm:px-7"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-5 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3">
            <h3 className="text-lg font-semibold text-slate-950">
              {steps[activeStep].title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {steps[activeStep].helper}
            </p>
          </div>

          {activeStep === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput id="fullName" {...fieldProps} autoComplete="name" />
              <TextInput id="fatherOrHusbandName" {...fieldProps} />
              <TextInput id="motherName" {...fieldProps} />
              <TextInput id="dateOfBirth" {...fieldProps} type="date" />
              <SelectInput id="gender" {...fieldProps} />
              <TextInput id="nidOrBirthNumber" {...fieldProps} />
              <TextInput id="mobile" {...fieldProps} type="tel" autoComplete="tel" />
              <TextInput
                id="email"
                {...fieldProps}
                type="email"
                autoComplete="email"
                placeholder={text.optionalLabel}
              />
              <TextArea id="presentAddress" {...fieldProps} />
              <TextArea id="permanentAddress" {...fieldProps} />
              <TextInput id="district" {...fieldProps} />
              <TextInput id="upazila" {...fieldProps} />
              <TextInput id="unionWard" {...fieldProps} />
              <TextInput id="villageArea" {...fieldProps} />
              <SelectInput id="maritalStatus" {...fieldProps} />
              <TextInput id="familyMembers" {...fieldProps} type="number" />
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput id="monthlyIncome" {...fieldProps} type="number" />
              <TextInput id="mainOccupation" {...fieldProps} />
              <SelectInput id="financialCondition" {...fieldProps} />
              <SelectInput id="assistanceType" {...fieldProps} />
              <TextInput id="expectedAssistance" {...fieldProps} />
              <TextArea id="assistancePurpose" {...fieldProps} />
              <div className="sm:col-span-2">
                <TextArea id="assistanceReason" {...fieldProps} />
              </div>
              <div className="sm:col-span-2">
                <CheckboxField id="repaymentCommitment" {...fieldProps} />
              </div>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput id="guarantorName" {...fieldProps} />
              <TextInput id="guarantorFatherOrHusbandName" {...fieldProps} />
              <TextInput id="guarantorNid" {...fieldProps} />
              <TextInput id="guarantorMobile" {...fieldProps} type="tel" />
              <TextInput
                id="guarantorEmail"
                {...fieldProps}
                type="email"
                placeholder={text.optionalLabel}
              />
              <TextInput id="guarantorOccupation" {...fieldProps} />
              <TextInput id="guarantorRelation" {...fieldProps} />
              <TextInput id="knownDuration" {...fieldProps} placeholder={text.hints.knownDuration} />
              <TextArea id="guarantorPresentAddress" {...fieldProps} />
              <TextArea id="guarantorPermanentAddress" {...fieldProps} />
              <TextInput id="guarantorDistrict" {...fieldProps} />
              <TextInput id="guarantorUpazila" {...fieldProps} />
              <SelectInput id="confirmsInfo" {...fieldProps} />
              <SelectInput id="supportsVerification" {...fieldProps} />
              <div className="sm:col-span-2">
                <TextArea id="guarantorComment" {...fieldProps} placeholder={text.optionalLabel} />
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FileInput id="applicantNidCopy" {...fieldProps} />
              <FileInput id="applicantPhoto" {...fieldProps} />
              <FileInput id="addressProof" {...fieldProps} />
              <FileInput id="incomeCertificate" {...fieldProps} />
              <FileInput id="recommendationLetter" {...fieldProps} />
              <FileInput id="guarantorNidCopy" {...fieldProps} />
              <FileInput id="guarantorPhoto" {...fieldProps} />
              <TextInput id="password" {...fieldProps} type="password" autoComplete="new-password" />
              <TextInput
                id="confirmPassword"
                {...fieldProps}
                type="password"
                autoComplete="new-password"
              />
              <div className="grid gap-3 sm:col-span-2">
                <CheckboxField id="terms" {...fieldProps} />
                <CheckboxField id="truthConfirmed" {...fieldProps} />
                <CheckboxField id="guarantorKnownConfirmed" {...fieldProps} />
                <CheckboxField id="guarantorCooperationConfirmed" {...fieldProps} />
                <CheckboxField id="digitalSignature" {...fieldProps} />
              </div>
            </div>
          ) : null}

          {isSubmitted ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              <strong className="block font-semibold">{text.successTitle}</strong>
              {text.successText}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
            {activeStep === 0 ? (
              <a
                href="/register#beneficiary-registration"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {text.backToRegistration}
              </a>
            ) : (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={goBack}
              >
                {text.back}
              </button>
            )}
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
                onClick={goNext}
              >
                {text.continue}
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
              >
                {text.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
