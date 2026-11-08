export const requiredByStep = {
  0: [
    "fullName", "fatherOrHusbandName", "motherName", "dateOfBirth", "gender",
    "nidOrBirthNumber", "mobile", "presentAddress", "permanentAddress",
    "divisionId", "districtId", "upazilaId", "unionWard", "villageArea",
    "maritalStatus", "familyMembers",
  ],
  1: [
    "monthlyIncome", "mainOccupation", "financialCondition", "assistanceReason",
    "assistanceType", "expectedAssistance", "assistancePurpose", "repaymentCommitment",
  ],
  2: [
    "guarantorName", "guarantorFatherOrHusbandName", "guarantorNid", "guarantorMobile",
    "guarantorOccupation", "guarantorRelation", "guarantorPresentAddress", "guarantorPermanentAddress",
    "guarantorDivisionId", "guarantorDistrictId", "guarantorUpazilaId", "knownDuration",
    "confirmsInfo", "supportsVerification",
  ],
  3: [
    "applicantNidCopy", "applicantPhoto", "guarantorNidCopy", "terms", "truthConfirmed",
    "guarantorKnownConfirmed", "guarantorCooperationConfirmed", "digitalSignature",
  ],
};

export const locationIdLabelKeys = {
  divisionId: "division",
  districtId: "district",
  upazilaId: "upazila",
  guarantorDivisionId: "guarantorDivision",
  guarantorDistrictId: "guarantorDistrict",
  guarantorUpazilaId: "guarantorUpazila",
};

const requiredFields = new Set(Object.values(requiredByStep).flat());
for (const [id, label] of Object.entries(locationIdLabelKeys)) {
  if (requiredFields.has(id)) requiredFields.add(label);
}

export function isRequiredBeneficiaryField(name) {
  return requiredFields.has(name);
}
