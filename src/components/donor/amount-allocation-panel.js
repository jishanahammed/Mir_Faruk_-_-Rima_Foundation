"use client";

import Link from "next/link";
import { useActionState, useCallback, useEffect, useState } from "react";
import { assignAmountAction, searchBeneficiariesAction } from "@/app/doner/amount-allocation/actions";
import { apiGet } from "@/lib/api/browser-api-service";

function formatAmount(amount) {
  const parsed = Number(amount);

  if (!Number.isFinite(parsed)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function SummaryCard({ label, value, tone }) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-950",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-[24px] border p-5 shadow-sm shadow-emerald-950/5 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-black">৳ {formatAmount(value)}</p>
    </div>
  );
}

function useLocationOptions(divisionId, districtId, upazilaId, localGovernmentId) {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [localGovernments, setLocalGovernments] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    let cancelled = false;

    apiGet("Locations/divisions")
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setDivisions(data);
        }
      })
      .catch(() => {
        if (!cancelled) setDivisions([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        if (!cancelled) setDistricts([]);
      });

    return () => {
      cancelled = true;
    };
  }, [divisionId]);

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
        if (!cancelled) setUpazilas([]);
      });

    return () => {
      cancelled = true;
    };
  }, [districtId]);

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
        if (!cancelled) setLocalGovernments([]);
      });

    return () => {
      cancelled = true;
    };
  }, [upazilaId]);

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
        if (!cancelled) setWards([]);
      });

    return () => {
      cancelled = true;
    };
  }, [localGovernmentId]);

  return { divisions, districts, upazilas, localGovernments, wards };
}

const SEARCH_INITIAL_STATE = { status: "idle", result: null, errorMessage: "" };
const ASSIGN_INITIAL_STATE = { status: "idle", errorMessage: "", message: "", summary: null };

function formatPaymentDate(value) {
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
    .replaceAll("/", "-");
}

function buildPaymentLabel(payment) {
  return [
    `৳ ${formatAmount(payment.amount)}`,
    payment.transactionId,
    formatPaymentDate(payment.paymentDate),
  ]
    .filter(Boolean)
    .join(" · ");
}

function AssignRow({ beneficiary, payments, onAssigned }) {
  const [paymentId, setPaymentId] = useState("");
  const [state, formAction, isPending] = useActionState(assignAmountAction, ASSIGN_INITIAL_STATE);

  const selectedPayment = payments.find((payment) => String(payment.id) === paymentId) ?? null;

  useEffect(() => {
    if (state.status === "success" && state.summary) {
      onAssigned(state.summary, state.assignedPaymentId);
      setPaymentId("");
    }
  }, [state, onAssigned]);

  return (
    <li className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-emerald-950/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-black text-slate-950">{beneficiary.fullName}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">ID: {beneficiary.id}</p>
          <p className="mt-1 text-xs text-slate-500">
            {[
              beneficiary.ward ? `Ward ${beneficiary.ward}` : "",
              beneficiary.unionParishadorPourashava,
              beneficiary.upazila,
              beneficiary.district,
              beneficiary.division,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
          {beneficiary.assistanceType ? (
            <p className="mt-1 text-xs font-semibold text-emerald-700">{beneficiary.assistanceType}</p>
          ) : null}
          <Link
            href={`/doner/amount-allocation/${beneficiary.id}`}
            className="mt-2 inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800"
          >
            View Profile
          </Link>
        </div>

        <form action={formAction} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="beneficiaryProfileId" value={beneficiary.id} />
          <input type="hidden" name="amount" value={selectedPayment?.amount ?? ""} />
          <select
            name="paymentHistoryId"
            value={paymentId}
            onChange={(event) => setPaymentId(event.target.value)}
            required
            disabled={payments.length === 0}
            className="h-11 w-64 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
          >
            <option value="">
              {payments.length === 0 ? "No available payment" : "Select payment"}
            </option>
            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {buildPaymentLabel(payment)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isPending || !selectedPayment}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Assigning..." : "Assign"}
          </button>
        </form>
      </div>

      {state.status === "error" && state.errorMessage ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {state.errorMessage}
        </p>
      ) : null}

      {state.status === "success" && state.message ? (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          {state.message}
        </p>
      ) : null}
    </li>
  );
}

export function AmountAllocationPanel({ initialSummary, initialAssignablePayments = [] }) {
  const [summary, setSummary] = useState(initialSummary);
  const [payments, setPayments] = useState(initialAssignablePayments);
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [upazilaId, setUpazilaId] = useState("");
  const [localGovernmentId, setLocalGovernmentId] = useState("");
  const [wardId, setWardId] = useState("");
  const { divisions, districts, upazilas, localGovernments, wards } = useLocationOptions(
    divisionId,
    districtId,
    upazilaId,
    localGovernmentId,
  );
  const [searchState, searchAction, isSearching] = useActionState(
    searchBeneficiariesAction,
    SEARCH_INITIAL_STATE,
  );

  const handleAssigned = useCallback((nextSummary, assignedPaymentId) => {
    setSummary(nextSummary);

    if (assignedPaymentId) {
      setPayments((current) =>
        current.filter((payment) => String(payment.id) !== String(assignedPaymentId)),
      );
    }
  }, []);

  return (
    <div className="space-y-5 xl:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Payment Amount" value={summary.totalPaymentAmount} tone="slate" />
        <SummaryCard label="Approved Amount" value={summary.totalApprovedAmount} tone="emerald" />
        <SummaryCard label="Pending Approval" value={summary.totalPendingAmount} tone="amber" />
        <SummaryCard label="Total Available Amount" value={summary.totalAvailableAmount} tone="emerald" />
      </div>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6">
        <h2 className="text-lg font-black text-slate-950">Find beneficiaries by location</h2>
        <p className="mt-1 text-sm text-slate-500">
          Narrow down by division, district, upazila, union parishad / pourashava and ward — or search
          by name — to find beneficiaries you can assign your available amount to.
        </p>

        <form action={searchAction} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Division
            </span>
            <select
              name="divisionId"
              value={divisionId}
              onChange={(event) => {
                setDivisionId(event.target.value);
                setDistrictId("");
                setUpazilaId("");
                setLocalGovernmentId("");
                setWardId("");
              }}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Select division</option>
              {divisions.map((item) => (
                <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
                  {item.nameEn ?? item.NameEn}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              District
            </span>
            <select
              name="districtId"
              value={districtId}
              onChange={(event) => {
                setDistrictId(event.target.value);
                setUpazilaId("");
                setLocalGovernmentId("");
                setWardId("");
              }}
              disabled={!divisionId}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            >
              <option value="">Select district</option>
              {districts.map((item) => (
                <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
                  {item.nameEn ?? item.NameEn}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Upazila
            </span>
            <select
              name="upazilaId"
              value={upazilaId}
              onChange={(event) => {
                setUpazilaId(event.target.value);
                setLocalGovernmentId("");
                setWardId("");
              }}
              disabled={!districtId}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            >
              <option value="">Select upazila</option>
              {upazilas.map((item) => (
                <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
                  {item.nameEn ?? item.NameEn}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Union Parishad / Pourashava
            </span>
            <select
              name="unionParishadorPourashavaId"
              value={localGovernmentId}
              onChange={(event) => {
                setLocalGovernmentId(event.target.value);
                setWardId("");
              }}
              disabled={!upazilaId}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            >
              <option value="">
                {upazilaId && localGovernments.length === 0
                  ? "None found"
                  : "Select union / pourashava"}
              </option>
              {localGovernments.map((item) => (
                <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
                  {item.nameEn ?? item.NameEn}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Ward
            </span>
            <select
              name="wardId"
              value={wardId}
              onChange={(event) => setWardId(event.target.value)}
              disabled={!localGovernmentId}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            >
              <option value="">
                {localGovernmentId && wards.length === 0 ? "None found" : "Select ward"}
              </option>
              {wards.map((item) => (
                <option key={item.id ?? item.Id} value={item.id ?? item.Id}>
                  {item.wardNo ?? item.WardNo}
                  {(item.nameEn ?? item.NameEn) ? ` — ${item.nameEn ?? item.NameEn}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Search beneficiary
            </span>
            <input
              type="search"
              name="search"
              placeholder="Name, mobile or NID"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <div className="flex items-end sm:col-span-2">
            <button
              type="submit"
              disabled={isSearching}
              className="h-12 w-full rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </section>

      {searchState.status === "error" && searchState.errorMessage ? (
        <section className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:px-5 sm:py-4">
          {searchState.errorMessage}
        </section>
      ) : null}

      {searchState.status === "success" && searchState.result ? (
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-950">
            Beneficiaries ({searchState.result.totalCount})
          </h2>

          {searchState.result.items.length === 0 ? (
            <p className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm text-slate-500">
              No approved beneficiaries were found for the selected location.
            </p>
          ) : (
            <ul className="space-y-4">
              {searchState.result.items.map((beneficiary) => (
                <AssignRow
                  key={beneficiary.id}
                  beneficiary={beneficiary}
                  payments={payments}
                  onAssigned={handleAssigned}
                />
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
