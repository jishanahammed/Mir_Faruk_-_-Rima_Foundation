import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const borderColor = "#9CA3AF";
const mutedBorder = "#D1D5DB";
const reportFontFamily = "NotoSansBengali";

Font.register({
  family: reportFontFamily,
  fonts: [
    { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansBengali-Bold.ttf", fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback((word) => {
  const value = String(word ?? "");

  if (value.length <= 16) {
    return [value];
  }

  return value.match(/.{1,16}/g) ?? [value];
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 44,
    paddingHorizontal: 28,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    fontFamily: reportFontFamily,
    fontSize: 8.4,
    lineHeight: 1.28,
  },
  header: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 8,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  titleBlock: {
    flexGrow: 1,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  foundationName: {
    fontWeight: 700,
    fontSize: 15,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  foundationSub: {
    fontSize: 8.2,
    marginBottom: 4,
  },
  reportTitle: {
    fontWeight: 700,
    fontSize: 11.5,
    textTransform: "uppercase",
    textDecoration: "underline",
  },
  photoBox: {
    width: 66,
    height: 76,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 64,
    height: 74,
    objectFit: "cover",
  },
  photoText: {
    fontSize: 7,
    textAlign: "center",
    color: "#4B5563",
    paddingHorizontal: 4,
  },
  metaRow: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor,
    marginBottom: 6,
  },
  metaCell: {
    width: "25%",
    borderRightWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 4,
  },
  metaLabel: {
    fontSize: 7,
    color: "#374151",
    marginBottom: 2,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  metaValue: {
    fontWeight: 700,
    fontSize: 9,
    flexShrink: 1,
  },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    backgroundColor: "#F3F4F6",
    fontWeight: 700,
    fontSize: 8.4,
    textTransform: "uppercase",
  },
  table: {
    borderLeftWidth: 1,
    borderStyle: "solid",
    borderColor,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  fieldCell: {
    width: "50%",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    paddingVertical: 3,
    paddingHorizontal: 5,
    minHeight: 19,
  },
  fieldFull: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  cellLabel: {
    width: 76,
    fontWeight: 700,
    fontSize: 6.8,
    textTransform: "uppercase",
    flexShrink: 0,
    color: "#374151",
  },
  cellSeparator: {
    width: 7,
    fontWeight: 700,
    fontSize: 7,
    color: "#374151",
  },
  cellValue: {
    fontSize: 8.1,
    flexGrow: 1,
    flexShrink: 1,
    color: "#111827",
  },
  longText: {
    minHeight: 24,
  },
  checklistHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
  },
  docTypeCol: {
    width: "22%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 4,
  },
  docNameCol: {
    width: "33%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 4,
  },
  docStatusCol: {
    width: "13%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 4,
  },
  docRemarksCol: {
    width: "32%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 4,
  },
  declaration: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    padding: 5,
    marginTop: 3,
    minHeight: 32,
  },
  declarationText: {
    fontSize: 8,
    textAlign: "justify",
  },
  signatureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  signatureBox: {
    flexGrow: 0,
    flexShrink: 0,
    width: "31.8%",
    minHeight: 56,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: mutedBorder,
    padding: 5,
    justifyContent: "flex-end",
  },
  signatureSeal: {
    width: 46,
    height: 46,
    objectFit: "contain",
    alignSelf: "center",
    marginBottom: 4,
  },
  signatureDate: {
    textAlign: "center",
    fontSize: 7.5,
    color: "#374151",
    marginBottom: 3,
  },
  signatureName: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 8.5,
    marginBottom: 5,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor,
    paddingTop: 4,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 8,
  },
  signatureRole: {
    textAlign: "center",
    fontSize: 7.5,
    color: "#4B5563",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 18,
    paddingTop: 6,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: mutedBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#4B5563",
    flexShrink: 1,
  },
});

const documentTypes = [
  ["ApplicantNidCopy", "Applicant NID / Birth Certificate Copy"],
  ["ApplicantPhoto", "Applicant Photo"],
  ["GuarantorNidCopy", "Guarantor NID Copy"],
  ["GuarantorPhoto", "Guarantor Photograph"],
  ["AddressProof", "Address Proof"],
  ["IncomeCertificate", "Income / Poverty Certificate"],
  ["RecommendationLetter", "Recommendation Letter"],
];

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, "-");
}

function formatCurrency(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "";
  }

  return `BDT ${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function text(value, fallback = "") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function isImageDocument(document) {
  const documentType = String(document.documentType ?? "").toLowerCase();
  const fileName = String(document.originalFileName ?? "").toLowerCase();
  const filePath = String(document.filePath ?? document.fileUrl ?? "").toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "webp"];

  return (
    documentType === "applicantphoto" ||
    documentType === "guarantorphoto" ||
    documentType === "beneficiaryphoto" ||
    String(document.contentType ?? "").toLowerCase().startsWith("image/") ||
    imageExtensions.includes(String(document.extension ?? "").toLowerCase()) ||
    imageExtensions.some((extension) => fileName.endsWith(`.${extension}`)) ||
    imageExtensions.some((extension) => filePath.endsWith(`.${extension}`))
  );
}

function getApplicantPhoto(beneficiary) {
  const documents = Array.isArray(beneficiary.documents) ? beneficiary.documents : [];
  const matchedPhoto = documents.find((document) => {
    const documentType = String(document.documentType ?? "").toLowerCase();
    const label = String(document.label ?? "").toLowerCase();
    const fileName = String(document.originalFileName ?? "").toLowerCase();

    return (
      documentType.includes("applicantphoto") ||
      documentType.includes("beneficiaryphoto") ||
      label.includes("applicant photo") ||
      label.includes("applicant photograph") ||
      label.includes("beneficiary photo") ||
      label.includes("beneficiary photograph") ||
      fileName.includes("applicant") ||
      fileName.includes("beneficiary")
    );
  });

  return matchedPhoto ?? documents.find(isImageDocument);
}

function getSubmissionDate(beneficiary, fallbackDate) {
  return beneficiary.submittedAt || beneficiary.createdAt || beneficiary.acceptedAt || fallbackDate;
}

function isApproved(value) {
  return String(value ?? "").trim().toLowerCase() === "approved";
}

function hasDocument(beneficiary, documentType) {
  return beneficiary.documents?.some(
    (document) =>
      String(document.documentType ?? "").toLowerCase() === String(documentType).toLowerCase(),
  );
}

function getDocumentByType(beneficiary, documentType) {
  return beneficiary.documents?.find(
    (document) =>
      String(document.documentType ?? "").toLowerCase() === String(documentType).toLowerCase(),
  );
}

function FieldCell({ label, value, full = false, long = false }) {
  return (
    <View style={[full ? styles.fieldFull : styles.fieldCell, long ? styles.longText : null]}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellSeparator}>:</Text>
      <Text style={styles.cellValue}>{text(value)}</Text>
    </View>
  );
}

function PairRow({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <View style={styles.row}>
      <FieldCell label={leftLabel} value={leftValue} />
      <FieldCell label={rightLabel} value={rightValue} />
    </View>
  );
}

function FullRow({ label, value, long = false }) {
  return (
    <View style={styles.row}>
      <FieldCell label={label} value={value} full long={long} />
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>{children}</View>
    </View>
  );
}

function DocumentChecklist({ beneficiary }) {
  return (
    <Section title="7. Documents Received">
      <View style={styles.checklistHeader}>
        <View style={styles.docTypeCol}>
          <Text style={styles.cellLabel}>Document Type</Text>
        </View>
        <View style={styles.docNameCol}>
          <Text style={styles.cellLabel}>Document Name</Text>
        </View>
        <View style={styles.docStatusCol}>
          <Text style={styles.cellLabel}>Received</Text>
        </View>
        <View style={styles.docRemarksCol}>
          <Text style={styles.cellLabel}>Remarks</Text>
        </View>
      </View>
      {documentTypes.map(([documentType, label]) => {
        const document = getDocumentByType(beneficiary, documentType);
        const received = Boolean(document);

        return (
          <View key={documentType} style={styles.row}>
            <View style={styles.docTypeCol}>
              <Text style={styles.cellValue}>{documentType}</Text>
            </View>
            <View style={styles.docNameCol}>
              <Text style={styles.cellValue}>{label}</Text>
            </View>
            <View style={styles.docStatusCol}>
              <Text style={styles.cellValue}>{received ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.docRemarksCol}>
              <Text style={styles.cellValue}>{received ? text(document.originalFileName, "Submitted") : ""}</Text>
            </View>
          </View>
        );
      })}
    </Section>
  );
}

function SignatureBox({ title, signerName, date, role, sealSrc }) {
  return (
    <View style={styles.signatureBox}>

      {sealSrc ? <Image src={sealSrc} style={styles.signatureSeal} /> : null}
      {text(signerName) ? <Text style={styles.signatureName}>{text(signerName)}</Text> : null}
      <Text style={styles.signatureDate}>Date: {formatDate(date)}</Text>
      <Text style={styles.signatureLine}>{title}</Text>
      {role ? <Text style={styles.signatureRole}>{role}</Text> : null}
    </View>
  );
}

export function BeneficiaryReportDocument({ beneficiary, generatedAt, logoSrc, approvalSealSrc }) {
  const applicantPhoto = getApplicantPhoto(beneficiary);
  const submissionDate = getSubmissionDate(beneficiary, generatedAt);
  const approved = isApproved(beneficiary.status);

  return (
    <Document
      title={`Beneficiary Application Report - ${text(beneficiary.fullName, "Applicant")}`}
      author="Mir Faruk & Rima Foundation"
      subject="Beneficiary application report"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : <View style={styles.logo} />}
            <View style={styles.titleBlock}>
              <Text style={styles.foundationName}>Mir Faruk & Rima Foundation</Text>
              <Text style={styles.foundationSub}>
                Beneficiary Assistance Program - Administrative Review Copy
              </Text>
              <Text style={styles.reportTitle}>Beneficiary Application Report</Text>
            </View>
            <View style={styles.photoBox}>
              {applicantPhoto?.fileUrl ? (
                <Image src={applicantPhoto.fileUrl} style={styles.photo} />
              ) : (
                <Text style={styles.photoText}>Beneficiary Photo</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Application ID</Text>
            <Text style={styles.metaValue}>#{text(beneficiary.id)}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaValue}>{text(beneficiary.status)}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Submitted Date</Text>
            <Text style={styles.metaValue}>{formatDate(submissionDate)}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Report Date</Text>
            <Text style={styles.metaValue}>{formatDate(generatedAt)}</Text>
          </View>
        </View>

        <Section title="1. Official Use Only">
          <PairRow leftLabel="Application Type" leftValue="Beneficiary Assistance" rightLabel="Review Status" rightValue={beneficiary.status} />
          <PairRow leftLabel="Assigned Officer" leftValue="" rightLabel="Verification Date" rightValue="" />
          <PairRow leftLabel="Decision" leftValue="" rightLabel="Remarks" rightValue="" />
        </Section>

        <Section title="2. Applicant Information">
          <PairRow leftLabel="Full Name" leftValue={beneficiary.fullName} rightLabel="User ID" rightValue={beneficiary.userId} />
          <PairRow leftLabel="Father / Husband" leftValue={beneficiary.fatherOrHusbandName} rightLabel="Mother Name" rightValue={beneficiary.motherName} />
          <PairRow leftLabel="Date of Birth" leftValue={formatDate(beneficiary.dateOfBirth)} rightLabel="Gender" rightValue={beneficiary.gender} />
          <PairRow leftLabel="NID / Birth No." leftValue={beneficiary.nidOrBirthNumber} rightLabel="Mobile" rightValue={beneficiary.mobile} />
          <PairRow leftLabel="Email" leftValue={beneficiary.email} rightLabel="Marital Status" rightValue={beneficiary.maritalStatus} />
          <PairRow leftLabel="Family Members" leftValue={beneficiary.familyMembers} rightLabel="District" rightValue={beneficiary.district} />
          <PairRow leftLabel="Upazila" leftValue={beneficiary.upazila} rightLabel="Union / Ward" rightValue={beneficiary.unionWard} />
          <FullRow label="Village / Area" value={beneficiary.villageArea} />
          <FullRow label="Present Address" value={beneficiary.presentAddress} long />
          <FullRow label="Permanent Address" value={beneficiary.permanentAddress} long />
        </Section>

        <Section title="3. Assistance Information">
          <PairRow leftLabel="Monthly Income" leftValue={formatCurrency(beneficiary.monthlyIncome)} rightLabel="Occupation" rightValue={beneficiary.mainOccupation} />
          <PairRow leftLabel="Financial Condition" leftValue={beneficiary.financialCondition} rightLabel="Assistance Type" rightValue={beneficiary.assistanceType} />
          <FullRow label="Expected Assistance" value={beneficiary.expectedAssistance} />
          <FullRow label="Reason for Assistance" value={beneficiary.assistanceReason} long />
          <FullRow label="Purpose of Assistance" value={beneficiary.assistancePurpose} long />
          <PairRow leftLabel="Repayment Commitment" leftValue={yesNo(beneficiary.repaymentCommitment)} rightLabel="Requested Under" rightValue="Qard Hasanah / Welfare Support" />
        </Section>

        <Section title="4. Guarantor Information">
          <PairRow leftLabel="Name" leftValue={beneficiary.guarantorName} rightLabel="Father / Husband" rightValue={beneficiary.guarantorFatherOrHusbandName} />
          <PairRow leftLabel="NID Number" leftValue={beneficiary.guarantorNid} rightLabel="Mobile" rightValue={beneficiary.guarantorMobile} />
          <PairRow leftLabel="Email" leftValue={beneficiary.guarantorEmail} rightLabel="Occupation" rightValue={beneficiary.guarantorOccupation} />
          <PairRow leftLabel="Relationship" leftValue={beneficiary.guarantorRelation} rightLabel="Known Duration" rightValue={beneficiary.knownDuration} />
          <PairRow leftLabel="Confirms Info" leftValue={beneficiary.confirmsInfo} rightLabel="Supports Verification" rightValue={beneficiary.supportsVerification} />
          <PairRow leftLabel="District" leftValue={beneficiary.guarantorDistrict} rightLabel="Upazila" rightValue={beneficiary.guarantorUpazila} />
          <FullRow label="Present Address" value={beneficiary.guarantorPresentAddress} />
          <FullRow label="Permanent Address" value={beneficiary.guarantorPermanentAddress} />
          <FullRow label="Comment" value={beneficiary.guarantorComment} />
        </Section>

        <Section title="5. Applicant Declaration">
          <PairRow leftLabel="Terms Accepted" leftValue={yesNo(beneficiary.termsAccepted)} rightLabel="Truth Confirmed" rightValue={yesNo(beneficiary.truthConfirmed)} />
          <PairRow leftLabel="Guarantor Known" leftValue={yesNo(beneficiary.guarantorKnownConfirmed)} rightLabel="Cooperation Confirmed" rightValue={yesNo(beneficiary.guarantorCooperationConfirmed)} />
          <PairRow leftLabel="Digital Signature" leftValue={yesNo(beneficiary.digitalSignatureConfirmed)} rightLabel="Accepted Date" rightValue={formatDate(beneficiary.acceptedAt)} />
        </Section>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Declaration Statement</Text>
          <View style={styles.declaration}>
            <Text style={styles.declarationText}>
              I declare that the information provided in this application is true and complete
              to the best of my knowledge. I understand that the foundation may verify the
              applicant, guarantor, residence, income condition, and submitted documents before
              making an administrative decision.
            </Text>
          </View>
        </View>

        <DocumentChecklist beneficiary={beneficiary} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Administrative Recommendation</Text>
          <View style={styles.declaration}>
            <Text style={styles.declarationText}>
              Verification summary / recommendation:
            </Text>
          </View>
          <View style={styles.signatureGrid}>
            <SignatureBox
              title="Applicant Signature"
              signerName={beneficiary.fullName}
              date={submissionDate}
              role="Applicant"
            />
            <SignatureBox
              title="Guarantor Signature"
              signerName={beneficiary.guarantorName}
              date={submissionDate}
              role="Guarantor"
            />
            <SignatureBox
              title="Founder & CEO"
              date={approved ? generatedAt : ""}
              role="Mir Faruk & Rima Foundation"
              sealSrc={approved ? approvalSealSrc : ""}
            />
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by Mir Faruk & Rima Foundation admin panel
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
