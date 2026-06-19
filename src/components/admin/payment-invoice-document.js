import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const primary = "#0F766E";
const ink = "#0F172A";
const muted = "#64748B";
const border = "#CBD5E1";
const soft = "#F8FAFC";

const styles = StyleSheet.create({
  page: {
    padding: 34,
    backgroundColor: "#FFFFFF",
    color: ink,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
  },
  topBar: {
    height: 8,
    marginHorizontal: -34,
    marginTop: -34,
    marginBottom: 24,
    backgroundColor: primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "62%",
  },
  logo: {
    width: 54,
    height: 54,
    objectFit: "contain",
    marginRight: 12,
  },
  foundationName: {
    fontSize: 16,
    fontWeight: 700,
    color: ink,
    textTransform: "uppercase",
  },
  foundationSub: {
    marginTop: 3,
    fontSize: 9,
    color: muted,
  },
  invoiceLabel: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  invoiceNumber: {
    marginTop: 5,
    fontSize: 9,
    color: muted,
  },
  statusStrip: {
    flexDirection: "row",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 10,
    overflow: "hidden",
  },
  statusCell: {
    width: "33.33%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: border,
    backgroundColor: soft,
  },
  statusCellLast: {
    borderRightWidth: 0,
  },
  label: {
    fontSize: 7,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  strong: {
    fontSize: 11,
    fontWeight: 700,
    color: ink,
  },
  amountCard: {
    marginBottom: 20,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#ECFEFF",
    borderWidth: 1,
    borderColor: "#A5F3FC",
  },
  amountLabel: {
    fontSize: 8,
    color: "#155E75",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amountValue: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: 700,
    color: "#164E63",
  },
  statusSuccess: {
    color: "#047857",
  },
  statusPending: {
    color: "#B45309",
  },
  statusFailed: {
    color: "#DC2626",
  },
  statusRefunded: {
    color: "#475569",
  },
  statusApproved: {
    color: "#047857",
  },
  statusWaiting: {
    color: "#0369A1",
  },
  statusRejected: {
    color: "#DC2626",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    paddingBottom: 4,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: border,
    fontSize: 11,
    fontWeight: 700,
    color: primary,
    textTransform: "uppercase",
  },
  grid: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: border,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: "50%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: border,
    minHeight: 30,
  },
  fullCell: {
    width: "100%",
  },
  fieldLine: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  fieldLabel: {
    width: 92,
    flexShrink: 0,
    fontSize: 7.4,
    fontWeight: 700,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 0.45,
  },
  fieldSeparator: {
    width: 10,
    flexShrink: 0,
    fontSize: 9,
    fontWeight: 700,
    color: muted,
  },
  value: {
    fontSize: 10,
    color: ink,
    flexGrow: 1,
    flexShrink: 1,
  },
  noteBox: {
    minHeight: 52,
    padding: 10,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 8,
    backgroundColor: soft,
  },
  noteText: {
    color: "#334155",
    fontSize: 9.5,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  signatureBox: {
    width: "42%",
    minHeight: 72,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  signatureTopSlot: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  signatureDivider: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#475569",
    marginBottom: 6,
  },
  approvalSeal: {
    width: 52,
    height: 52,
    objectFit: "contain",
    marginBottom: 4,
  },
  signatureTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: ink,
    textAlign: "center",
  },
  signatureSub: {
    marginTop: 2,
    fontSize: 8,
    color: muted,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 22,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: muted,
  },
});

function text(value, fallback = "Not available") {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
}

function formatLabel(value) {
  const labels = {
    GeneralDonation: "General Donation",
    QardEHasanaFund: "Qard-e-Hasana Fund",
    bKash: "bKash",
  };

  if (labels[value]) {
    return labels[value];
  }

  return String(value ?? "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", "-");
}

function formatMoney(amount, currency) {
  const parsed = Number(amount);
  const value = Number.isFinite(parsed) ? parsed : 0;

  return `${text(currency, "BDT")} ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function Field({ label, value, full = false }) {
  return (
    <View style={[styles.cell, full ? styles.fullCell : null]}>
      <View style={styles.fieldLine}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldSeparator}>:</Text>
        <Text style={styles.value}>{text(value)}</Text>
      </View>
    </View>
  );
}

function getStatusStyle(value) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "success") {
    return styles.statusSuccess;
  }

  if (normalized === "pending") {
    return styles.statusPending;
  }

  if (normalized === "failed") {
    return styles.statusFailed;
  }

  if (normalized === "refunded") {
    return styles.statusRefunded;
  }

  if (normalized === "approved") {
    return styles.statusApproved;
  }

  if (normalized === "waiting") {
    return styles.statusWaiting;
  }

  if (normalized === "rejected") {
    return styles.statusRejected;
  }

  return null;
}

function StatusField({ label, value, last = false, colored = false }) {
  return (
    <View style={[styles.statusCell, last ? styles.statusCellLast : null]}>
      <View style={styles.fieldLine}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldSeparator}>:</Text>
        <Text style={[styles.value, styles.strong, colored ? getStatusStyle(value) : null]}>
          {text(value)}
        </Text>
      </View>
    </View>
  );
}

function isApproved(value) {
  return String(value ?? "").trim().toLowerCase() === "approved";
}

export function PaymentInvoiceDocument({ payment, generatedAt, logoSrc, approvalSealSrc }) {
  const invoiceNo = `MFRF-PAY-${String(payment.id ?? "").padStart(6, "0")}`;
  const approved = isApproved(payment.adminApprovalStatus);

  return (
    <Document
      title={`Payment Invoice - ${text(payment.transactionId, invoiceNo)}`}
      author="Mir Faruk & Rima Foundation"
      subject="Donor payment invoice"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <View style={styles.brand}>
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
            <View>
              <Text style={styles.foundationName}>Mir Faruk & Rima Foundation</Text>
              <Text style={styles.foundationSub}>Donor Payment Record and Invoice</Text>
            </View>
          </View>
          <View style={styles.invoiceLabel}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNumber}>{invoiceNo}</Text>
          </View>
        </View>

        <View style={styles.statusStrip}>
          <StatusField label="Payment Status" value={payment.paymentStatus} colored />
          <StatusField label="Admin Approval" value={payment.adminApprovalStatus} colored />
          <StatusField label="Generated On" value={formatDate(generatedAt)} last />
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Received Amount</Text>
          <Text style={styles.amountValue}>{formatMoney(payment.amount, payment.currency)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.grid}>
            <View style={styles.row}>
              <Field label="Transaction ID" value={payment.transactionId} />
              <Field label="Payment Date" value={formatDate(payment.paymentDate)} />
            </View>
            <View style={styles.row}>
              <Field label="Donation Type" value={formatLabel(payment.donationType)} />
              <Field label="Payment Method" value={formatLabel(payment.paymentMethod)} />
            </View>
            <View style={styles.row}>
              <Field label="Currency" value={payment.currency} />
              <Field label="Uploaded Receipt" value={payment.receiptUrl ? "Available" : "Not uploaded"} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donor Information</Text>
          <View style={styles.grid}>
            <View style={styles.row}>
              <Field label="Donor Name" value={payment.donorName} />
              <Field label="Phone Number" value={payment.donorMobile} />
            </View>
            <View style={styles.row}>
              <Field label="Donor Type" value={payment.donorType} />
              <Field label="Donor ID" value={payment.donorId ? `#${payment.donorId}` : ""} />
            </View>
            <View style={styles.row}>
              <Field label="Address" value={payment.donorAddress} full />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{text(payment.remarks, "No remarks added for this payment record.")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgement</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Thank you for your donation. Your support helps Mir Faruk & Rima Foundation
              continue its welfare and assistance programs. This invoice is generated from
              the administrative donor payment history record.
            </Text>
          </View>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureTopSlot}>
              <Text style={styles.signatureTitle}>Received By Accountant</Text>
            </View>
            <View style={styles.signatureDivider} />
            <Text style={styles.signatureSub}>Mir Faruk & Rima Foundation</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureTopSlot}>
              {approved && approvalSealSrc ? (
                <Image src={approvalSealSrc} style={styles.approvalSeal} />
              ) : null}
            </View>
            <View style={styles.signatureDivider} />
            <Text style={styles.signatureTitle}>Authorized Approval</Text>
            <Text style={styles.signatureSub}>{text(payment.adminApprovalStatus)}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by admin panel</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
