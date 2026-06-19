import "server-only";

import {
  DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS,
  getAdminDonorPaymentHistoryList,
} from "@/lib/api/admin-donor-payment-history-service";
import {
  BENEFICIARY_PAGE_SIZE_OPTIONS,
  getAdminBeneficiaryList,
} from "@/lib/api/admin-beneficiary-service";
import {
  DONOR_PAGE_SIZE_OPTIONS,
  getAdminDonorList,
} from "@/lib/api/admin-donor-service";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getStaticVolunteerAnalytics } from "@/lib/admin-volunteer-analytics";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EMPTY_YEAR = new Date().getFullYear();

function getMaxPageSize(options) {
  return Math.max(...options);
}

function createEmptyCollection() {
  return {
    totalCount: 0,
    items: [],
  };
}

function createLoader(loadPage) {
  return async function loadAllPages() {
    const firstPage = await loadPage(1);
    const totalPages = Math.max(1, Number(firstPage.totalPages) || 1);

    if (totalPages === 1) {
      return {
        totalCount: Number(firstPage.totalCount) || 0,
        items: Array.isArray(firstPage.items) ? firstPage.items : [],
      };
    }

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => loadPage(index + 2)),
    );

    return {
      totalCount: Number(firstPage.totalCount) || 0,
      items: [
        ...(Array.isArray(firstPage.items) ? firstPage.items : []),
        ...remainingPages.flatMap((page) => (Array.isArray(page.items) ? page.items : [])),
      ],
    };
  };
}

const loadAllDonors = createLoader((page) =>
  getAdminDonorList({
    page,
    pageSize: getMaxPageSize(DONOR_PAGE_SIZE_OPTIONS),
  }),
);

const loadAllBeneficiaries = createLoader((page) =>
  getAdminBeneficiaryList({
    page,
    pageSize: getMaxPageSize(BENEFICIARY_PAGE_SIZE_OPTIONS),
  }),
);

const loadAllPayments = createLoader((page) =>
  getAdminDonorPaymentHistoryList({
    page,
    pageSize: getMaxPageSize(DONOR_PAYMENT_HISTORY_PAGE_SIZE_OPTIONS),
  }),
);

function toDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDonationType(value) {
  const label = String(value ?? "").trim();

  if (!label) {
    return "Unspecified";
  }

  return label.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function sumAmount(items) {
  return items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
}

function buildDonationAnalytics(payments, volunteerAnalytics) {
  const successfulPayments = payments.filter((item) => item.paymentStatus === "Success");
  const approvedPayments = successfulPayments.filter(
    (item) => item.adminApprovalStatus === "Approved",
  );
  const waitingApprovalPayments = successfulPayments.filter(
    (item) => item.adminApprovalStatus === "Waiting",
  );
  const paymentSuccessRate = payments.length
    ? Math.round((successfulPayments.length / payments.length) * 100)
    : 0;

  const yearlyTotalsMap = new Map();
  const donationTypeMap = new Map();
  const paymentStatusMap = new Map();
  const approvalStatusMap = new Map();

  for (const payment of payments) {
    const paymentDate = toDate(payment.paymentDate ?? payment.createdAt);
    const paymentStatus = payment.paymentStatus || "Unknown";
    const approvalStatus = payment.adminApprovalStatus || "Unknown";

    paymentStatusMap.set(paymentStatus, (paymentStatusMap.get(paymentStatus) ?? 0) + 1);
    approvalStatusMap.set(approvalStatus, (approvalStatusMap.get(approvalStatus) ?? 0) + 1);

    if (payment.paymentStatus !== "Success" || !paymentDate) {
      continue;
    }

    const year = paymentDate.getFullYear();
    const monthIndex = paymentDate.getMonth();
    const amount = Number(payment.amount) || 0;
    const donationType = formatDonationType(payment.donationType);
    const existingYear = yearlyTotalsMap.get(year) ?? {
      year,
      totalAmount: 0,
      paymentCount: 0,
      monthlyTotals: Array.from({ length: 12 }, () => 0),
    };

    existingYear.totalAmount += amount;
    existingYear.paymentCount += 1;
    existingYear.monthlyTotals[monthIndex] += amount;
    yearlyTotalsMap.set(year, existingYear);

    donationTypeMap.set(donationType, (donationTypeMap.get(donationType) ?? 0) + amount);
  }

  const volunteerYear = volunteerAnalytics.monthlyRegistrations[0]?.year ?? EMPTY_YEAR;

  if (!yearlyTotalsMap.size) {
    yearlyTotalsMap.set(volunteerYear, {
      year: volunteerYear,
      totalAmount: 0,
      paymentCount: 0,
      monthlyTotals: Array.from({ length: 12 }, () => 0),
    });
  }

  const yearlyTotals = [...yearlyTotalsMap.values()].sort((left, right) => right.year - left.year);
  const selectedYear = yearlyTotals[0]?.year ?? volunteerYear;
  const selectedYearRecord = yearlyTotals.find((item) => item.year === selectedYear) ?? yearlyTotals[0];
  const monthlySeries = MONTH_LABELS.map((month, index) => ({
    month,
    monthIndex: index,
    totalAmount: Number(selectedYearRecord?.monthlyTotals?.[index] ?? 0),
  }));

  return {
    totalDonationAmount: sumAmount(successfulPayments),
    approvedDonationAmount: sumAmount(approvedPayments),
    waitingApprovalAmount: sumAmount(waitingApprovalPayments),
    successfulDonationCount: successfulPayments.length,
    approvedDonationCount: approvedPayments.length,
    waitingApprovalCount: waitingApprovalPayments.length,
    paymentSuccessRate,
    selectedYear,
    monthlySeries,
    yearlyTotals: yearlyTotals.map((item) => ({
      year: item.year,
      totalAmount: item.totalAmount,
      paymentCount: item.paymentCount,
    })),
    donationTypeTotals: [...donationTypeMap.entries()]
      .map(([type, totalAmount]) => ({ type, totalAmount }))
      .sort((left, right) => right.totalAmount - left.totalAmount),
    paymentStatusBreakdown: [...paymentStatusMap.entries()].map(([status, count]) => ({
      status,
      count,
    })),
    approvalStatusBreakdown: [...approvalStatusMap.entries()].map(([status, count]) => ({
      status,
      count,
    })),
  };
}

function buildBeneficiaryAnalytics(beneficiaries) {
  const currentYear = new Date().getFullYear();
  const monthlyTotals = Array.from({ length: 12 }, () => 0);
  const statusBreakdown = new Map();

  for (const beneficiary of beneficiaries) {
    const status = beneficiary.status || "Unknown";
    statusBreakdown.set(status, (statusBreakdown.get(status) ?? 0) + 1);

    const submittedDate = toDate(
      beneficiary.submittedAt ?? beneficiary.createdAt ?? beneficiary.updatedAt,
    );

    if (!submittedDate || submittedDate.getFullYear() !== currentYear) {
      continue;
    }

    monthlyTotals[submittedDate.getMonth()] += 1;
  }

  return {
    currentYear,
    totalApplications: beneficiaries.length,
    currentYearApplications: monthlyTotals.reduce((total, value) => total + value, 0),
    monthlySeries: MONTH_LABELS.map((month, index) => ({
      month,
      monthIndex: index,
      totalApplications: monthlyTotals[index],
    })),
    statusBreakdown: [...statusBreakdown.entries()].map(([status, count]) => ({
      status,
      count,
    })),
  };
}

function buildRecentActivities({ donors, beneficiaries, payments, volunteers }) {
  const donorActivities = donors.slice(0, 5).map((donor) => ({
    id: `donor-${donor.id}`,
    type: "Donor",
    title: "New donor registration",
    name: donor.fullName || "Unnamed donor",
    status: donor.isApprove ? "Approved" : "Pending approval",
    date: donor.createdAt ?? donor.updatedAt,
    description: donor.donorType || donor.purpose || "Registered in the donor directory.",
  }));

  const beneficiaryActivities = beneficiaries.slice(0, 5).map((beneficiary) => ({
    id: `beneficiary-${beneficiary.id}`,
    type: "Beneficiary",
    title: "Beneficiary application received",
    name: beneficiary.fullName || "Unnamed beneficiary",
    status: beneficiary.status || "Pending",
    date: beneficiary.submittedAt ?? beneficiary.createdAt ?? beneficiary.updatedAt,
    description:
      beneficiary.assistanceType || `${beneficiary.documentCount} supporting documents uploaded.`,
  }));

  const paymentActivities = payments.slice(0, 6).map((payment) => ({
    id: `payment-${payment.id}`,
    type: "Donation",
    title: "Donation payment recorded",
    name: payment.donorName || "Unnamed donor",
    status:
      payment.paymentStatus === "Success"
        ? payment.adminApprovalStatus === "Approved"
          ? "Approved"
          : "Awaiting approval"
        : payment.paymentStatus,
    date: payment.paymentDate ?? payment.createdAt ?? payment.updatedAt,
    description: `${formatDonationType(payment.donationType)} donation of ${payment.amount} ${payment.currency}.`,
  }));

  return [...paymentActivities, ...beneficiaryActivities, ...donorActivities, ...volunteers]
    .map((item) => ({
      ...item,
      timestamp: toDate(item.date)?.getTime() ?? 0,
    }))
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 8);
}

function buildSectionAnalytics({
  donors,
  beneficiaries,
  volunteers,
  donationAnalytics,
}) {
  const approvedDonors = donors.filter((item) => item.isApprove).length;
  const approvedBeneficiaries = beneficiaries.filter((item) => item.status === "Approved").length;
  const underReviewBeneficiaries = beneficiaries.filter(
    (item) => item.status === "Pending" || item.status === "UnderReview",
  ).length;
  const donorApprovalRate = donors.length ? Math.round((approvedDonors / donors.length) * 100) : 0;
  const beneficiaryApprovalRate = beneficiaries.length
    ? Math.round((approvedBeneficiaries / beneficiaries.length) * 100)
    : 0;

  return [
    {
      label: "Donor network",
      total: donors.length,
      accent: `${approvedDonors} approved donors`,
      note: `${donors.length - approvedDonors} donor records still need verification.`,
      percentage: donorApprovalRate,
    },
    {
      label: "Beneficiary support",
      total: beneficiaries.length,
      accent: `${approvedBeneficiaries} approved beneficiaries`,
      note: `${underReviewBeneficiaries} applications are pending review or follow-up.`,
      percentage: beneficiaryApprovalRate,
    },
    {
      label: "Volunteer operations",
      total: volunteers.totalVolunteers,
      accent: `${volunteers.activeVolunteers} volunteers active now`,
      note: `${volunteers.pendingOnboarding} volunteers are still in onboarding.`,
      percentage: volunteers.retentionRate,
    },
    {
      label: "Donation assurance",
      total: donationAnalytics.successfulDonationCount,
      accent: `${donationAnalytics.approvedDonationCount} donations approved`,
      note: `${donationAnalytics.waitingApprovalCount} successful donations are still waiting for admin confirmation.`,
      percentage: donationAnalytics.paymentSuccessRate,
    },
  ];
}

function buildOverview({
  donors,
  beneficiaries,
  volunteers,
  donationAnalytics,
  recentActivities,
}) {
  const pendingDonorApprovals = donors.filter((item) => !item.isApprove).length;
  const pendingBeneficiaryApprovals = beneficiaries.filter(
    (item) => item.status === "Pending" || item.status === "UnderReview",
  ).length;

  return {
    pendingApprovals:
      pendingDonorApprovals +
      pendingBeneficiaryApprovals +
      donationAnalytics.waitingApprovalCount +
      volunteers.pendingOnboarding,
    approvedDonors: donors.filter((item) => item.isApprove).length,
    approvedBeneficiaries: beneficiaries.filter((item) => item.status === "Approved").length,
    activeVolunteers: volunteers.activeVolunteers,
    availableVolunteersToday: volunteers.availableToday,
    recentActivitiesCount: recentActivities.length,
    averageDonationAmount:
      donationAnalytics.successfulDonationCount > 0
        ? donationAnalytics.totalDonationAmount / donationAnalytics.successfulDonationCount
        : 0,
  };
}

function buildWarnings(results) {
  return Object.entries(results)
    .filter(([, result]) => result.status === "rejected")
    .map(([key, result]) => ({
      section: key,
      message: getApiErrorMessage(result.reason),
    }));
}

export async function getAdminDashboardData() {
  const volunteerAnalytics = getStaticVolunteerAnalytics();
  const [donorsResult, beneficiariesResult, paymentsResult] = await Promise.allSettled([
    loadAllDonors(),
    loadAllBeneficiaries(),
    loadAllPayments(),
  ]);
  const donorsCollection =
    donorsResult.status === "fulfilled" ? donorsResult.value : createEmptyCollection();
  const beneficiariesCollection =
    beneficiariesResult.status === "fulfilled"
      ? beneficiariesResult.value
      : createEmptyCollection();
  const paymentsCollection =
    paymentsResult.status === "fulfilled" ? paymentsResult.value : createEmptyCollection();

  const donationAnalytics = buildDonationAnalytics(
    paymentsCollection.items,
    volunteerAnalytics,
  );
  const beneficiaryAnalytics = buildBeneficiaryAnalytics(beneficiariesCollection.items);
  const recentActivities = buildRecentActivities({
    donors: donorsCollection.items,
    beneficiaries: beneficiariesCollection.items,
    payments: paymentsCollection.items,
    volunteers: volunteerAnalytics.recentActivities,
  });
  const overview = buildOverview({
    donors: donorsCollection.items,
    beneficiaries: beneficiariesCollection.items,
    volunteers: volunteerAnalytics,
    donationAnalytics,
    recentActivities,
  });
  const sectionAnalytics = buildSectionAnalytics({
    donors: donorsCollection.items,
    beneficiaries: beneficiariesCollection.items,
    volunteers: volunteerAnalytics,
    donationAnalytics,
  });

  return {
    generatedAt: new Date().toISOString(),
    warnings: buildWarnings({
      donors: donorsResult,
      beneficiaries: beneficiariesResult,
      payments: paymentsResult,
    }),
    summary: {
      totalDonors: donorsCollection.totalCount,
      totalBeneficiaries: beneficiariesCollection.totalCount,
      totalVolunteers: volunteerAnalytics.totalVolunteers,
      totalDonations: donationAnalytics.totalDonationAmount,
      successfulDonationCount: donationAnalytics.successfulDonationCount,
    },
    overview,
    volunteers: volunteerAnalytics,
    beneficiaries: beneficiaryAnalytics,
    donations: donationAnalytics,
    sectionAnalytics,
    recentActivities,
  };
}
