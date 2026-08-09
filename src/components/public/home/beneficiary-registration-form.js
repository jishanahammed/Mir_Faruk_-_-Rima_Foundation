"use client";

import { useEffect, useMemo, useState } from "react";
import { useSiteLocale } from "@/components/public/providers/locale-provider";
import { apiGet } from "@/lib/api/browser-api-service";

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
    selectDivisionFirst: "select division first",
    selectDistrictFirst: "select district first",
    selectDivisionFirstOption: "— Select Division First —",
    selectDistrictFirstOption: "— Select District First —",
    noDistrictsFound: "No districts found",
    noUpazilasFound: "No upazilas found",
    selectUpazilaFirst: "select upazila first",
    selectUpazilaFirstOption: "— Select Upazila First —",
    selectLocalGovernmentFirst: "select union / pourashava first",
    selectLocalGovernmentFirstOption: "— Select Union / Pourashava First —",
    noLocalGovernmentsFound: "No union parishads / pourashavas found",
    noWardsFound: "No wards found",
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
      division: "Division",
      district: "District",
      upazila: "Upazila / Thana",
      unionParishadorPourashava: "Union Parishad / Pourashava",
      ward: "Ward No.",
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
      guarantorDivision: "Division",
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
    selectDivisionFirst: "প্রথমে বিভাগ নির্বাচন করুন",
    selectDistrictFirst: "প্রথমে জেলা নির্বাচন করুন",
    selectDivisionFirstOption: "— প্রথমে বিভাগ নির্বাচন করুন —",
    selectDistrictFirstOption: "— প্রথমে জেলা নির্বাচন করুন —",
    noDistrictsFound: "কোনো জেলা পাওয়া যায়নি",
    noUpazilasFound: "কোনো উপজেলা পাওয়া যায়নি",
    selectUpazilaFirst: "প্রথমে উপজেলা নির্বাচন করুন",
    selectUpazilaFirstOption: "— প্রথমে উপজেলা নির্বাচন করুন —",
    selectLocalGovernmentFirst: "প্রথমে ইউনিয়ন / পৌরসভা নির্বাচন করুন",
    selectLocalGovernmentFirstOption: "— প্রথমে ইউনিয়ন / পৌরসভা নির্বাচন করুন —",
    noLocalGovernmentsFound: "কোনো ইউনিয়ন পরিষদ / পৌরসভা পাওয়া যায়নি",
    noWardsFound: "কোনো ওয়ার্ড পাওয়া যায়নি",
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
      division: "বিভাগ",
      district: "জেলা",
      upazila: "উপজেলা / থানা",
      unionParishadorPourashava: "ইউনিয়ন পরিষদ / পৌরসভা",
      ward: "ওয়ার্ড নং",
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
      guarantorDivision: "বিভাগ",
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
    selectDivisionFirst: "vaelg division foerst",
    selectDistrictFirst: "vaelg distrikt foerst",
    selectDivisionFirstOption: "— Vaelg division foerst —",
    selectDistrictFirstOption: "— Vaelg distrikt foerst —",
    noDistrictsFound: "Ingen distrikter fundet",
    noUpazilasFound: "Ingen upazilaer fundet",
    selectUpazilaFirst: "vaelg upazila foerst",
    selectUpazilaFirstOption: "— Vaelg upazila foerst —",
    selectLocalGovernmentFirst: "vaelg union / pourashava foerst",
    selectLocalGovernmentFirstOption: "— Vaelg union / pourashava foerst —",
    noLocalGovernmentsFound: "Ingen union parishader / pourashavaer fundet",
    noWardsFound: "Ingen wards fundet",
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
      division: "Division",
      district: "Distrikt",
      upazila: "Upazila / Thana",
      unionParishadorPourashava: "Union Parishad / Pourashava",
      ward: "Ward nr.",
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
      guarantorDivision: "Division",
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
  divisionId: "",
  division: "",
  districtId: "",
  district: "",
  upazilaId: "",
  upazila: "",
  unionParishadorPourashavaId: "",
  unionParishadorPourashava: "",
  wardId: "",
  ward: "",
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
  guarantorDivisionId: "",
  guarantorDivision: "",
  guarantorDistrictId: "",
  guarantorDistrict: "",
  guarantorUpazilaId: "",
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
    "divisionId",
    "districtId",
    "upazilaId",
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
    "guarantorDivisionId",
    "guarantorDistrictId",
    "guarantorUpazilaId",
    "knownDuration",
    "confirmsInfo",
    "supportsVerification",
  ],
  3: [
    "applicantNidCopy",
    "applicantPhoto",
    "guarantorNidCopy",
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

function useLocationOptions() {
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    let cancelled = false;

    apiGet("Locations/divisions")
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setDivisions(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDivisions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return divisions;
}

function useDistrictOptions(divisionId) {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    apiGet(`Locations/districts?divisionId=${divisionId}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setDistricts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDistricts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [divisionId]);

  return districts;
}

function useUpazilaOptions(districtId) {
  const [upazilas, setUpazilas] = useState([]);

  useEffect(() => {
    if (!districtId) {
      setUpazilas([]);
      return;
    }

    let cancelled = false;

    apiGet(`Locations/upazilas?districtId=${districtId}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setUpazilas(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUpazilas([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [districtId]);

  return upazilas;
}

function useLocalGovernmentOptions(upazilaId) {
  const [localGovernments, setLocalGovernments] = useState([]);

  useEffect(() => {
    if (!upazilaId) {
      setLocalGovernments([]);
      return;
    }

    let cancelled = false;

    apiGet(`Locations/local-governments?upazilaId=${upazilaId}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setLocalGovernments(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocalGovernments([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [upazilaId]);

  return localGovernments;
}

function useWardOptions(localGovernmentId) {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (!localGovernmentId) {
      setWards([]);
      return;
    }

    let cancelled = false;

    apiGet(`Locations/wards?localGovernmentId=${localGovernmentId}`)
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setWards(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWards([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [localGovernmentId]);

  return wards;
}

function wardLabel(item, htmlLang) {
  if (!item) return "";
  const name = locationName(item, htmlLang);
  return name ? `${item.wardNo} — ${name}` : String(item.wardNo);
}

function locationName(item, htmlLang) {
  if (!item) return "";
  if (htmlLang === "bn") return item.nameBn || item.nameEn;
  if (htmlLang === "da") return item.nameDk || item.nameEn;
  return item.nameEn;
}

function LocationCascadeFields({
  prefix,
  form,
  errors,
  onChange,
  text,
  divisions,
  htmlLang,
  includeLocalGovernment = false,
}) {
  const divisionIdField = prefix ? `${prefix}DivisionId` : "divisionId";
  const divisionField = prefix ? `${prefix}Division` : "division";
  const districtIdField = prefix ? `${prefix}DistrictId` : "districtId";
  const districtField = prefix ? `${prefix}District` : "district";
  const upazilaIdField = prefix ? `${prefix}UpazilaId` : "upazilaId";
  const upazilaField = prefix ? `${prefix}Upazila` : "upazila";

  const districts = useDistrictOptions(form[divisionIdField]);
  const upazilas = useUpazilaOptions(form[districtIdField]);
  const localGovernments = useLocalGovernmentOptions(
    includeLocalGovernment ? form.upazilaId : "",
  );
  const wards = useWardOptions(
    includeLocalGovernment ? form.unionParishadorPourashavaId : "",
  );

  const clearLocalGovernmentAndWard = () => {
    if (!includeLocalGovernment) return;
    onChange("unionParishadorPourashavaId")({ target: { type: "text", value: "" } });
    onChange("unionParishadorPourashava")({ target: { type: "text", value: "" } });
    onChange("wardId")({ target: { type: "text", value: "" } });
    onChange("ward")({ target: { type: "text", value: "" } });
  };

  const handleLocalGovernmentChange = (event) => {
    const localGovernmentId = event.target.value;
    const selected = localGovernments.find((item) => String(item.id) === localGovernmentId);

    onChange("unionParishadorPourashavaId")({
      target: { type: "text", value: localGovernmentId },
    });
    onChange("unionParishadorPourashava")({
      target: { type: "text", value: selected ? locationName(selected, htmlLang) : "" },
    });
    onChange("wardId")({ target: { type: "text", value: "" } });
    onChange("ward")({ target: { type: "text", value: "" } });
  };

  const handleWardChange = (event) => {
    const wardId = event.target.value;
    const selected = wards.find((item) => String(item.id) === wardId);

    onChange("wardId")({ target: { type: "text", value: wardId } });
    onChange("ward")({
      target: { type: "text", value: selected ? wardLabel(selected, htmlLang) : "" },
    });
  };

  const handleDivisionChange = (event) => {
    const divisionId = event.target.value;
    const selected = divisions.find((item) => String(item.id) === divisionId);

    onChange(divisionIdField)({ target: { type: "text", value: divisionId } });
    onChange(divisionField)({
      target: { type: "text", value: selected ? locationName(selected, htmlLang) : "" },
    });
    onChange(districtIdField)({ target: { type: "text", value: "" } });
    onChange(districtField)({ target: { type: "text", value: "" } });
    onChange(upazilaIdField)({ target: { type: "text", value: "" } });
    onChange(upazilaField)({ target: { type: "text", value: "" } });
    clearLocalGovernmentAndWard();
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const selected = districts.find((item) => String(item.id) === districtId);

    onChange(districtIdField)({ target: { type: "text", value: districtId } });
    onChange(districtField)({
      target: { type: "text", value: selected ? locationName(selected, htmlLang) : "" },
    });
    onChange(upazilaIdField)({ target: { type: "text", value: "" } });
    onChange(upazilaField)({ target: { type: "text", value: "" } });
    clearLocalGovernmentAndWard();
  };

  const handleUpazilaChange = (event) => {
    const upazilaId = event.target.value;
    const selected = upazilas.find((item) => String(item.id) === upazilaId);

    onChange(upazilaIdField)({ target: { type: "text", value: upazilaId } });
    onChange(upazilaField)({
      target: { type: "text", value: selected ? locationName(selected, htmlLang) : "" },
    });
    clearLocalGovernmentAndWard();
  };

  return (
    <>
      <Field
        id={divisionIdField}
        label={text.labels[divisionField]}
        error={errors[divisionIdField]}
      >
        <select
          id={divisionIdField}
          name={divisionIdField}
          value={form[divisionIdField]}
          onChange={handleDivisionChange}
          className={inputClass(Boolean(errors[divisionIdField]))}
        >
          <option value="">
            {text.selectPrefix} {text.labels[divisionField]}
          </option>
          {divisions.map((item) => (
            <option key={item.id} value={item.id}>
              {locationName(item, htmlLang)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={districtIdField}
        label={
          <>
            {text.labels[districtField]}
            {!form[divisionIdField] ? (
              <span className="ml-1 text-[11px] font-normal text-slate-400">
                ({text.selectDivisionFirst})
              </span>
            ) : null}
          </>
        }
        error={errors[districtIdField]}
      >
        <select
          id={districtIdField}
          name={districtIdField}
          value={form[districtIdField]}
          onChange={handleDistrictChange}
          disabled={!form[divisionIdField]}
          className={inputClass(Boolean(errors[districtIdField]))}
        >
          <option value="">
            {form[divisionIdField]
              ? districts.length === 0
                ? text.noDistrictsFound
                : `${text.selectPrefix} ${text.labels[districtField]}`
              : text.selectDivisionFirstOption}
          </option>
          {districts.map((item) => (
            <option key={item.id} value={item.id}>
              {locationName(item, htmlLang)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={upazilaIdField}
        label={
          <>
            {text.labels[upazilaField]}
            {!form[districtIdField] ? (
              <span className="ml-1 text-[11px] font-normal text-slate-400">
                ({text.selectDistrictFirst})
              </span>
            ) : null}
          </>
        }
        error={errors[upazilaIdField]}
      >
        <select
          id={upazilaIdField}
          name={upazilaIdField}
          value={form[upazilaIdField]}
          onChange={handleUpazilaChange}
          disabled={!form[districtIdField]}
          className={inputClass(Boolean(errors[upazilaIdField]))}
        >
          <option value="">
            {form[districtIdField]
              ? upazilas.length === 0
                ? text.noUpazilasFound
                : `${text.selectPrefix} ${text.labels[upazilaField]}`
              : text.selectDistrictFirstOption}
          </option>
          {upazilas.map((item) => (
            <option key={item.id} value={item.id}>
              {locationName(item, htmlLang)}
            </option>
          ))}
        </select>
      </Field>

      {includeLocalGovernment ? (
        <>
          <Field
            id="unionParishadorPourashavaId"
            label={
              <>
                {text.labels.unionParishadorPourashava}
                {!form.upazilaId ? (
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    ({text.selectUpazilaFirst})
                  </span>
                ) : null}
              </>
            }
            error={errors.unionParishadorPourashavaId}
          >
            <select
              id="unionParishadorPourashavaId"
              name="unionParishadorPourashavaId"
              value={form.unionParishadorPourashavaId}
              onChange={handleLocalGovernmentChange}
              disabled={!form.upazilaId}
              className={inputClass(Boolean(errors.unionParishadorPourashavaId))}
            >
              <option value="">
                {form.upazilaId
                  ? localGovernments.length === 0
                    ? text.noLocalGovernmentsFound
                    : `${text.selectPrefix} ${text.labels.unionParishadorPourashava}`
                  : text.selectUpazilaFirstOption}
              </option>
              {localGovernments.map((item) => (
                <option key={item.id} value={item.id}>
                  {locationName(item, htmlLang)}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="wardId"
            label={
              <>
                {text.labels.ward}
                {!form.unionParishadorPourashavaId ? (
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    ({text.selectLocalGovernmentFirst})
                  </span>
                ) : null}
              </>
            }
            error={errors.wardId}
          >
            <select
              id="wardId"
              name="wardId"
              value={form.wardId}
              onChange={handleWardChange}
              disabled={!form.unionParishadorPourashavaId}
              className={inputClass(Boolean(errors.wardId))}
            >
              <option value="">
                {form.unionParishadorPourashavaId
                  ? wards.length === 0
                    ? text.noWardsFound
                    : `${text.selectPrefix} ${text.labels.ward}`
                  : text.selectLocalGovernmentFirstOption}
              </option>
              {wards.map((item) => (
                <option key={item.id} value={item.id}>
                  {wardLabel(item, htmlLang)}
                </option>
              ))}
            </select>
          </Field>
        </>
      ) : null}
    </>
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

const locationIdLabelKeys = {
  divisionId: "division",
  districtId: "district",
  upazilaId: "upazila",
  guarantorDivisionId: "guarantorDivision",
  guarantorDistrictId: "guarantorDistrict",
  guarantorUpazilaId: "guarantorUpazila",
};

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
      const labelKey = locationIdLabelKeys[field] ?? field;
      errors[field] = `${text.labels[labelKey]} ${text.requiredMessage}`;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);
  const divisions = useLocationOptions();

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
    setSubmitError("");

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

  async function submitRegistration() {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return;
      }

      if (typeof value === "boolean") {
        payload.append(key, String(value));
        return;
      }

      payload.append(key, value);
    });

    const response = await fetch("/api/beneficiaries/register", {
      method: "POST",
      body: payload,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.message ?? "Unable to complete beneficiary registration right now.",
      );
    }

    return result;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await submitRegistration();
      setIsSubmitted(true);
      setForm(initialFormState);
      setErrors({});
      setActiveStep(0);
    } catch (error) {
      setSubmitError(
        error?.message ?? "Unable to complete beneficiary registration right now.",
      );
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
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
              <LocationCascadeFields
                form={form}
                errors={errors}
                onChange={updateField}
                text={text}
                divisions={divisions}
                htmlLang={siteCopy.htmlLang}
                includeLocalGovernment
              />
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
              <LocationCascadeFields
                prefix="guarantor"
                form={form}
                errors={errors}
                onChange={updateField}
                text={text}
                divisions={divisions}
                htmlLang={siteCopy.htmlLang}
              />
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
              <div className="grid gap-3 sm:col-span-2">
                <CheckboxField id="terms" {...fieldProps} />
                <CheckboxField id="truthConfirmed" {...fieldProps} />
                <CheckboxField id="guarantorKnownConfirmed" {...fieldProps} />
                <CheckboxField id="guarantorCooperationConfirmed" {...fieldProps} />
                <CheckboxField id="digitalSignature" {...fieldProps} />
              </div>
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              <strong className="block font-semibold">Registration could not be submitted</strong>
              {submitError}
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
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
                onClick={goNext}
              >
                {text.continue}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full border border-transparent bg-[linear-gradient(135deg,_#0f766e,_#0891b2)] px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-200/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/70"
              >
                {isSubmitting ? "Submitting..." : text.submit}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
