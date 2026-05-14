"use client";

import { trackEvent } from "@lib/analytics";
import { EmployeeRangeSheet } from "@molecule/forms/employee-range-sheet";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export interface WaitlistFormProps {
  closeModal: () => void;
}

const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];
const fieldLabelClassName = "mb-2 block text-sm font-medium text-white";
const textFieldClassName =
  "mt-1 block w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/45 shadow-sm outline-none transition focus:border-indigo-400 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/30";
const selectFieldClassName =
  "mt-1 block w-full min-h-12 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-base text-white shadow-sm outline-none transition focus:border-indigo-400 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/30 sm:min-h-0 sm:py-2.5 sm:text-sm";
const mobileSelectorClassName =
  "mt-1 flex w-full min-h-12 items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-left text-base text-white shadow-sm outline-none transition focus:border-indigo-400 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/30 sm:hidden";
const choiceLabelClassName =
  "flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 transition hover:border-white/20 hover:bg-white/8";
const helperErrorClassName = "mt-1 text-sm text-rose-300";

export function WaitlistForm({ closeModal }: WaitlistFormProps) {
  const t = useTranslations("waitlist");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isEmployeeRangeSheetOpen, setIsEmployeeRangeSheetOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "personal" as "personal" | "company",
    companyName: "",
    employeeRange: "",
    email: "",
    message: "",
    consentPrivacy: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.currentTarget;
    const { name } = target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "type" && value !== "company") {
      setIsEmployeeRangeSheetOpen(false);
    }

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/waitlist/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 400) {
          // Validation errors
          const errors = data.errors || [];
          const newFieldErrors: Record<string, string> = {};
          for (const err of errors) {
            newFieldErrors[err.field] = err.message;
          }
          setFieldErrors(newFieldErrors);
          setError(t("validationError"));
          trackEvent("waitlist_submit_error", {
            error_type: "validation",
            locale,
            submit_type: formData.type,
          });
        } else if (response.status === 429) {
          setError(t("rateLimitError"));
          trackEvent("waitlist_submit_error", {
            error_type: "rate_limit",
            locale,
            submit_type: formData.type,
          });
        } else if (response.status === 409) {
          setError(t("duplicateEmailError"));
          trackEvent("waitlist_submit_error", {
            error_type: "duplicate",
            locale,
            submit_type: formData.type,
          });
        } else {
          setError(data.error || t("genericError"));
          trackEvent("waitlist_submit_error", {
            error_type: "unknown",
            locale,
            submit_type: formData.type,
            status_code: response.status,
          });
        }
      } else {
        trackEvent("waitlist_submit_success", {
          locale,
          submit_type: formData.type,
        });

        // Success
        setFormData({
          name: "",
          type: "personal",
          companyName: "",
          employeeRange: "",
          email: "",
          message: "",
          consentPrivacy: false,
        });

        // Show success message and close modal after delay
        setTimeout(() => {
          closeModal();
        }, 1500);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(t("networkError"));
      trackEvent("waitlist_submit_error", {
        error_type: "network",
        locale,
        submit_type: formData.type,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedEmployeeRangeLabel =
    formData.employeeRange || t("employeeRangeDefault");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className={fieldLabelClassName}>
          {t("nameLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className={textFieldClassName}
          placeholder={t("namePlaceholder")}
        />
        {fieldErrors.name && (
          <p className={helperErrorClassName}>{fieldErrors.name}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className={fieldLabelClassName}>
          {t("typeLabel")} <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={choiceLabelClassName}>
            <input
              type="radio"
              name="type"
              value="personal"
              checked={formData.type === "personal"}
              onChange={handleChange}
              className="h-4 w-4 border-white/30 bg-transparent text-indigo-400 focus:ring-indigo-500/40"
            />
            <span className="ml-2 text-sm text-white/90">
              {t("typePersonal")}
            </span>
          </label>
          <label className={choiceLabelClassName}>
            <input
              type="radio"
              name="type"
              value="company"
              checked={formData.type === "company"}
              onChange={handleChange}
              className="h-4 w-4 border-white/30 bg-transparent text-indigo-400 focus:ring-indigo-500/40"
            />
            <span className="ml-2 text-sm text-white/90">
              {t("typeCompany")}
            </span>
          </label>
        </div>
      </div>

      {/* Company Name (conditional) */}
      {formData.type === "company" && (
        <div>
          <label htmlFor="companyName" className={fieldLabelClassName}>
            {t("companyNameLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            className={textFieldClassName}
            placeholder={t("companyNamePlaceholder")}
          />
          {fieldErrors.companyName && (
            <p className={helperErrorClassName}>{fieldErrors.companyName}</p>
          )}
        </div>
      )}

      {/* Employee Range (conditional) */}
      {formData.type === "company" && (
        <div>
          <label htmlFor="employeeRange" className={fieldLabelClassName}>
            {t("employeeRangeLabel")}
          </label>
          <select
            id="employeeRange"
            name="employeeRange"
            value={formData.employeeRange}
            onChange={handleChange}
            className={`${selectFieldClassName} hidden sm:block`}
          >
            <option value="">{t("employeeRangeDefault")}</option>
            {EMPLOYEE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range} {t("employees")}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-controls="employee-range-sheet"
            aria-expanded={isEmployeeRangeSheetOpen}
            onClick={() => setIsEmployeeRangeSheetOpen(true)}
            className={`${mobileSelectorClassName} sm:hidden`}
          >
            <span className="flex min-w-0 flex-col items-start text-left">
              <span className="mt-1 text-base font-semibold text-white">
                {selectedEmployeeRangeLabel}
              </span>
            </span>
          </button>

          {fieldErrors.employeeRange && (
            <p className={helperErrorClassName}>{fieldErrors.employeeRange}</p>
          )}

          <EmployeeRangeSheet
            open={isEmployeeRangeSheetOpen}
            value={formData.employeeRange}
            title={t("employeeRangeLabel")}
            closeLabel={t("employeeRangeDefault")}
            optionLabel={t("employeeRangeDefault")}
            onClose={() => setIsEmployeeRangeSheetOpen(false)}
            onSelect={(nextValue) => {
              setFormData((prev) => ({ ...prev, employeeRange: nextValue }));
              setIsEmployeeRangeSheetOpen(false);

              if (fieldErrors.employeeRange) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.employeeRange;
                  return next;
                });
              }
            }}
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className={fieldLabelClassName}>
          {t("emailLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={textFieldClassName}
          placeholder={t("emailPlaceholder")}
        />
        {fieldErrors.email && (
          <p className={helperErrorClassName}>{fieldErrors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={fieldLabelClassName}>
          {t("messageLabel")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={textFieldClassName}
          placeholder={t("messagePlaceholder")}
        />
        {fieldErrors.message && (
          <p className={helperErrorClassName}>{fieldErrors.message}</p>
        )}
      </div>

      {/* Consent */}
      <div className="rounded-lg  py-3">
        <div className="flex items-start gap-3">
          <input
            id="consentPrivacy"
            name="consentPrivacy"
            type="checkbox"
            checked={formData.consentPrivacy}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent text-indigo-400 focus:ring-indigo-500/40"
          />
          <label
            htmlFor="consentPrivacy"
            className="block text-sm leading-6 text-white/90"
          >
            {t("consentLabel")} <span className="text-red-500">*</span>
          </label>
        </div>
      </div>
      {fieldErrors.consentPrivacy && (
        <p className={helperErrorClassName}>{fieldErrors.consentPrivacy}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("submitting") : t("submitButton")}
      </button>
    </form>
  );
}
