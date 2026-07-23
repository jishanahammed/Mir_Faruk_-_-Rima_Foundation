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
    fontSize: 9,
    lineHeight: 1.4,
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
    marginBottom: 20,
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
  statementLabel: {
    textAlign: "right",
  },
  statementTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  statementMeta: {
    marginTop: 4,
    fontSize: 8.5,
    color: muted,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    paddingBottom: 4,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: border,
    fontSize: 10.5,
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
    minHeight: 28,
  },
  fieldLine: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  fieldLabel: {
    width: 92,
    flexShrink: 0,
    fontSize: 7.2,
    fontWeight: 700,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldSeparator: {
    width: 10,
    flexShrink: 0,
    fontSize: 9,
    fontWeight: 700,
    color: muted,
  },
  value: {
    fontSize: 9.5,
    color: ink,
    flexGrow: 1,
    flexShrink: 1,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  summaryCard: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 12,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  summaryCardLast: {
    marginRight: 0,
  },
  summaryLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  summarySub: {
    marginTop: 3,
    fontSize: 7.5,
    color: muted,
  },
  creditedCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  creditedLabel: {
    color: "#047857",
  },
  creditedValue: {
    color: "#065F46",
  },
  pendingCard: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  pendingLabel: {
    color: "#B45309",
  },
  pendingValue: {
    color: "#92400E",
  },
  reversedCard: {
    backgroundColor: soft,
    borderColor: border,
  },
  reversedLabel: {
    color: muted,
  },
  reversedValue: {
    color: "#334155",
  },
  table: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: border,
  },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: soft,
  },
  tableRow: {
    flexDirection: "row",
  },
  th: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: border,
    fontSize: 7.2,
    fontWeight: 700,
    color: muted,
    textTransform: "uppercase",
  },
  td: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: border,
    fontSize: 8,
    color: ink,
  },
  colSl: { width: "6%" },
  colTxn: { width: "18%" },
  colDate: { width: "12%" },
  colType: { width: "18%" },
  colMethod: { width: "14%" },
  colAmount: { width: "13%", textAlign: "right" },
  colStatus: { width: "19%" },
  statusSuccess: { color: "#047857" },
  statusPending: { color: "#B45309" },
  statusFailed: { color: "#DC2626" },
  statusRefunded: { color: "#475569" },
  statusApproved: { color: "#047857" },
  statusWaiting: { color: "#0369A1" },
  statusRejected: { color: "#DC2626" },
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
  noteBox: {
    marginTop: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: border,
    borderRadius: 8,
    backgroundColor: soft,
  },
  noteText: {
    color: "#334155",
    fontSize: 8.5,
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

function formatMoney(amount, currency = "BDT") {
  const parsed = Number(amount);
  const value = Number.isFinite(parsed) ? parsed : 0;

  return `${text(currency, "BDT")} ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function Field({ label, value }) {
  return (
    <View style={styles.cell}>
      <View style={styles.fieldLine}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldSeparator}>:</Text>
        <Text style={styles.value}>{text(value)}</Text>
      </View>
    </View>
  );
}

function isCredited(payment) {
  return (
    String(payment.paymentStatus ?? "").toLowerCase() === "success" &&
    String(payment.adminApprovalStatus ?? "").toLowerCase() === "approved"
  );
}

function isPending(payment) {
  const paymentStatus = String(payment.paymentStatus ?? "").toLowerCase();
  const approvalStatus = String(payment.adminApprovalStatus ?? "").toLowerCase();
  return paymentStatus === "pending" || approvalStatus === "waiting";
}

function isReversed(payment) {
  const paymentStatus = String(payment.paymentStatus ?? "").toLowerCase();
  return paymentStatus === "failed" || paymentStatus === "refunded";
}

function getStatusStyle(value) {
  const normalized = String(value ?? "").toLowerCase();
  const map = {
    success: styles.statusSuccess,
    pending: styles.statusPending,
    failed: styles.statusFailed,
    refunded: styles.statusRefunded,
    approved: styles.statusApproved,
    waiting: styles.statusWaiting,
    rejected: styles.statusRejected,
  };

  return map[normalized] ?? null;
}

function chunkRows(items, rowsPerPage) {
  const pages = [];

  for (let index = 0; index < items.length; index += rowsPerPage) {
    pages.push(items.slice(index, index + rowsPerPage));
  }

  return pages.length ? pages : [[]];
}

export function DonationStatementDocument({ donor, payments, generatedAt, logoSrc }) {
  const currency = payments.find((item) => item.currency)?.currency ?? "BDT";

  const credited = payments.filter(isCredited);
  const pending = payments.filter(isPending);
  const reversed = payments.filter(isReversed);

  const totalCredited = credited.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPending = pending.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalReversed = reversed.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const sortedByDate = [...payments].sort(
    (a, b) => new Date(a.paymentDate ?? 0) - new Date(b.paymentDate ?? 0),
  );
  const firstDonationDate = sortedByDate[0]?.paymentDate ?? null;
  const lastDonationDate = sortedByDate[sortedByDate.length - 1]?.paymentDate ?? null;

  const rowsByPage = chunkRows(payments, 24);

  return (
    <Document
      title={`Donation Statement - ${text(donor.fullName, "Donor")}`}
      author="Mir Faruk & Rima Foundation"
      subject="Donor donation statement"
    >
      {rowsByPage.map((rows, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.topBar} />

          {pageIndex === 0 ? (
            <>
              <View style={styles.header}>
                <View style={styles.brand}>
                  {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
                  <View>
                    <Text style={styles.foundationName}>Mir Faruk & Rima Foundation</Text>
                    <Text style={styles.foundationSub}>Donor Donation Statement</Text>
                  </View>
                </View>
                <View style={styles.statementLabel}>
                  <Text style={styles.statementTitle}>Statement</Text>
                  <Text style={styles.statementMeta}>Generated on {formatDate(generatedAt)}</Text>
                  <Text style={styles.statementMeta}>{payments.length} total transactions</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Donor Information</Text>
                <View style={styles.grid}>
                  <View style={styles.row}>
                    <Field label="Donor Name" value={donor.fullName} />
                    <Field label="Donor ID" value={donor.id ? `#${donor.id}` : ""} />
                  </View>
                  <View style={styles.row}>
                    <Field label="Phone Number" value={donor.mobile} />
                    <Field label="Email" value={donor.email} />
                  </View>
                  <View style={styles.row}>
                    <Field label="Donor Type" value={donor.donorType} />
                    <Field label="Statement Period" value="All-time (full history)" />
                  </View>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, styles.creditedCard]}>
                  <Text style={[styles.summaryLabel, styles.creditedLabel]}>Total Credited</Text>
                  <Text style={[styles.summaryValue, styles.creditedValue]}>
                    {formatMoney(totalCredited, currency)}
                  </Text>
                  <Text style={styles.summarySub}>{credited.length} approved transactions</Text>
                </View>
                <View style={[styles.summaryCard, styles.pendingCard]}>
                  <Text style={[styles.summaryLabel, styles.pendingLabel]}>Pending Review</Text>
                  <Text style={[styles.summaryValue, styles.pendingValue]}>
                    {formatMoney(totalPending, currency)}
                  </Text>
                  <Text style={styles.summarySub}>{pending.length} awaiting approval</Text>
                </View>
                <View style={[styles.summaryCard, styles.reversedCard, styles.summaryCardLast]}>
                  <Text style={[styles.summaryLabel, styles.reversedLabel]}>Reversed / Failed</Text>
                  <Text style={[styles.summaryValue, styles.reversedValue]}>
                    {formatMoney(totalReversed, currency)}
                  </Text>
                  <Text style={styles.summarySub}>{reversed.length} failed or refunded</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lifetime Overview</Text>
                <View style={styles.grid}>
                  <View style={styles.row}>
                    <Field label="First Donation" value={formatDate(firstDonationDate)} />
                    <Field label="Most Recent" value={formatDate(lastDonationDate)} />
                  </View>
                </View>
              </View>
            </>
          ) : null}

          <View style={styles.section}>
            {pageIndex === 0 ? <Text style={styles.sectionTitle}>Transaction Ledger</Text> : null}
            <View style={styles.table}>
              <View style={styles.tableHeadRow} fixed>
                <Text style={[styles.th, styles.colSl]}>SL</Text>
                <Text style={[styles.th, styles.colTxn]}>Transaction ID</Text>
                <Text style={[styles.th, styles.colDate]}>Date</Text>
                <Text style={[styles.th, styles.colType]}>Donation Type</Text>
                <Text style={[styles.th, styles.colMethod]}>Method</Text>
                <Text style={[styles.th, styles.colAmount]}>Amount</Text>
                <Text style={[styles.th, styles.colStatus, { borderRightWidth: 0 }]}>Status</Text>
              </View>

              {rows.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.td, styles.colSl]}>{pageIndex * 24 + index + 1}</Text>
                  <Text style={[styles.td, styles.colTxn]}>{text(item.transactionId)}</Text>
                  <Text style={[styles.td, styles.colDate]}>{formatDate(item.paymentDate)}</Text>
                  <Text style={[styles.td, styles.colType]}>{formatLabel(item.donationType)}</Text>
                  <Text style={[styles.td, styles.colMethod]}>{formatLabel(item.paymentMethod)}</Text>
                  <Text style={[styles.td, styles.colAmount]}>
                    {formatMoney(item.amount, item.currency)}
                  </Text>
                  <Text style={[styles.td, styles.colStatus, { borderRightWidth: 0 }]}>
                    <Text style={getStatusStyle(item.paymentStatus)}>
                      {formatLabel(item.paymentStatus)}
                    </Text>
                    {" / "}
                    <Text style={getStatusStyle(item.adminApprovalStatus)}>
                      {formatLabel(item.adminApprovalStatus)}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {pageIndex === rowsByPage.length - 1 ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                This statement reflects all donation transactions recorded for this donor
                account as of the generation date above. For questions about any entry,
                please contact the foundation&apos;s donation support team.
              </Text>
            </View>
          ) : null}

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Generated from the donor portal</Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
