import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { isRequiredBeneficiaryField } from "@/lib/beneficiary-registration-fields";

const fontFamily = "BeneficiaryRegistrationNoto";
Font.register({
  family: fontFamily,
  fonts: [
    { src: "/fonts/NotoSansBengali-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/NotoSansBengali-Bold.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { paddingTop: 28, paddingHorizontal: 32, paddingBottom: 42, fontFamily, fontSize: 9, lineHeight: 1.4, color: "#111827" },
  header: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#64748b", paddingBottom: 12, marginBottom: 14 },
  logo: { width: 58, height: 50, objectFit: "contain", marginRight: 14 },
  heading: { flex: 1 },
  foundation: { fontSize: 14, fontWeight: 700 },
  title: { fontSize: 11, marginTop: 3 },
  instructions: { fontSize: 8, color: "#475569", marginBottom: 12 },
  section: { fontSize: 12, fontWeight: 700, padding: 8, backgroundColor: "#f1f5f9", marginBottom: 12 },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1, marginBottom: 10 },
  label: { fontSize: 9, fontWeight: 700, marginBottom: 4 },
  line: { height: 22, borderBottomWidth: 0.6, borderBottomColor: "#94a3b8" },
  tallLine: { height: 42, borderBottomWidth: 0.6, borderBottomColor: "#94a3b8" },
  options: { fontSize: 7, color: "#475569", marginTop: 3 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 13 },
  box: { width: 10, height: 10, borderWidth: 0.8, borderColor: "#475569", marginTop: 2, marginRight: 8 },
  checkText: { flex: 1 },
  subheading: { fontSize: 10, fontWeight: 700, marginTop: 12, marginBottom: 10 },
  signature: { marginTop: 24 },
  footer: { position: "absolute", bottom: 20, left: 32, right: 32, fontSize: 8, color: "#64748b", textAlign: "center" },
});

function Field({ name, text, tall = false }) {
  return (
    <View style={styles.field} wrap={false}>
      <Text style={styles.label}>{text.labels[name]}{isRequiredBeneficiaryField(name) ? " *" : ""}</Text>
      <View style={tall ? styles.tallLine : styles.line} />
      {text.options[name] ? <Text style={styles.options}>{text.options[name].join(" / ")}</Text> : null}
    </View>
  );
}

function Fields({ names, text, tall = false }) {
  return <View style={styles.row}>{names.map((name) => <Field key={name} name={name} text={text} tall={tall} />)}</View>;
}

function Checkbox({ children, required = false }) {
  return <View style={styles.checkRow} wrap={false}><View style={styles.box} /><Text style={styles.checkText}>{children}{required ? " *" : ""}</Text></View>;
}

function FormPage({ text, step, number, children }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src="/logo.png" style={styles.logo} />
        <View style={styles.heading}>
          <Text style={styles.foundation}>Mir Faruk &amp; Rima Foundation</Text>
          <Text style={styles.title}>{text.title}</Text>
        </View>
      </View>
      <Text style={styles.section}>{number}. {text.steps[step].title}</Text>
      <Text style={styles.instructions}>* {text.requiredFieldNote}</Text>
      {children}
      <Text fixed style={styles.footer} render={({ pageNumber, totalPages }) => `${text.title} | ${pageNumber} / ${totalPages}`} />
    </Page>
  );
}

export function BeneficiaryRegistrationDocument({ text }) {
  const documentFields = ["applicantNidCopy", "applicantPhoto", "addressProof", "incomeCertificate", "recommendationLetter", "guarantorNidCopy", "guarantorPhoto"];
  const agreements = ["terms", "truthConfirmed", "guarantorKnownConfirmed", "guarantorCooperationConfirmed"];

  return (
    <Document title="Beneficiary Registration Form" author="Mir Faruk & Rima Foundation" subject="Printable beneficiary registration form">
      <FormPage text={text} step="basic" number={1}>
        <Text style={styles.instructions}>{text.pdf.instructions}</Text>
        <Fields names={["fullName", "fatherOrHusbandName"]} text={text} />
        <Fields names={["motherName", "dateOfBirth"]} text={text} />
        <Fields names={["gender", "nidOrBirthNumber"]} text={text} />
        <Fields names={["mobile", "email"]} text={text} />
        <Field name="presentAddress" text={text} tall />
        <Field name="permanentAddress" text={text} tall />
        <Fields names={["division", "district", "upazila"]} text={text} />
        <Fields names={["unionParishadorPourashava", "ward"]} text={text} />
        <Fields names={["unionWard", "villageArea"]} text={text} />
        <Fields names={["maritalStatus", "familyMembers"]} text={text} />
      </FormPage>

      <FormPage text={text} step="assistance" number={2}>
        <Fields names={["monthlyIncome", "mainOccupation"]} text={text} />
        <Field name="financialCondition" text={text} />
        <Field name="assistanceType" text={text} />
        <Field name="expectedAssistance" text={text} tall />
        <Field name="assistanceReason" text={text} tall />
        <Field name="assistancePurpose" text={text} tall />
        <Checkbox required={isRequiredBeneficiaryField("repaymentCommitment")}>{text.labels.repaymentCommitment}</Checkbox>
        <View style={styles.signature}>
          <Text style={styles.label}>{text.pdf.applicantSignature}{isRequiredBeneficiaryField("digitalSignature") ? " *" : ""}</Text><View style={styles.line} />
          <Text style={styles.options}>{text.pdf.date}: ____________________</Text>
        </View>
      </FormPage>

      <FormPage text={text} step="guarantor" number={3}>
        <Fields names={["guarantorName", "guarantorFatherOrHusbandName"]} text={text} />
        <Fields names={["guarantorNid", "guarantorMobile"]} text={text} />
        <Fields names={["guarantorEmail", "guarantorOccupation"]} text={text} />
        <Fields names={["guarantorRelation", "knownDuration"]} text={text} />
        <Field name="guarantorPresentAddress" text={text} tall />
        <Field name="guarantorPermanentAddress" text={text} tall />
        <Fields names={["guarantorDivision", "guarantorDistrict", "guarantorUpazila"]} text={text} />
        <Field name="confirmsInfo" text={text} />
        <Field name="supportsVerification" text={text} />
        <Field name="guarantorComment" text={text} tall />
      </FormPage>

      <FormPage text={text} step="documents" number={4}>
        {documentFields.map((name) => <Checkbox key={name} required={isRequiredBeneficiaryField(name)}>{text.labels[name]}{text.hints[name] === text.optionalLabel ? ` (${text.optionalLabel})` : ""}</Checkbox>)}
        <Text style={styles.subheading}>{text.steps.documents.title}</Text>
        {agreements.map((name) => <Checkbox key={name} required={isRequiredBeneficiaryField(name)}>{text.labels[name]}</Checkbox>)}
        <View style={[styles.row, styles.signature]}>
          {[text.pdf.applicantSignature, text.pdf.guarantorSignature].map((label) => (
            <View key={label} style={styles.field}>
              <Text style={styles.label}>{label}{isRequiredBeneficiaryField("digitalSignature") ? " *" : ""}</Text><View style={styles.tallLine} />
              <Text style={styles.options}>{text.pdf.date}: ____________________</Text>
            </View>
          ))}
        </View>
      </FormPage>
    </Document>
  );
}
