"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export interface WaitlistFormProps {
  closeModal: () => void;
}

const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "500+"];

export function WaitlistForm({ closeModal }: WaitlistFormProps) {
  const t = useTranslations("waitlist");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.currentTarget;
    const { name } = target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" 
      ? (target as HTMLInputElement).checked 
      : target.value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        } else if (response.status === 429) {
          setError(t("rateLimitError"));
        } else if (response.status === 409) {
          setError(t("duplicateEmailError"));
        } else {
          setError(data.error || t("genericError"));
        }
      } else {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t("nameLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
          placeholder={t("namePlaceholder")}
        />
        {fieldErrors.name && <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("typeLabel")} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="personal"
              checked={formData.type === "personal"}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-700">{t("typePersonal")}</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="company"
              checked={formData.type === "company"}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-700">{t("typeCompany")}</span>
          </label>
        </div>
      </div>

      {/* Company Name (conditional) */}
      {formData.type === "company" && (
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            {t("companyNameLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
            placeholder={t("companyNamePlaceholder")}
          />
          {fieldErrors.companyName && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.companyName}</p>
          )}
        </div>
      )}

      {/* Employee Range (conditional) */}
      {formData.type === "company" && (
        <div>
          <label htmlFor="employeeRange" className="block text-sm font-medium text-gray-700">
            {t("employeeRangeLabel")}
          </label>
          <select
            id="employeeRange"
            name="employeeRange"
            value={formData.employeeRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">{t("employeeRangeDefault")}</option>
            {EMPLOYEE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range} {t("employees")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t("emailLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
          placeholder={t("emailPlaceholder")}
        />
        {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {t("messageLabel")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 shadow-sm border focus:border-indigo-500 focus:ring-indigo-500"
          placeholder={t("messagePlaceholder")}
        />
        {fieldErrors.message && <p className="mt-1 text-sm text-red-500">{fieldErrors.message}</p>}
      </div>

      {/* Consent */}
      <div className="flex items-center">
        <input
          id="consentPrivacy"
          name="consentPrivacy"
          type="checkbox"
          checked={formData.consentPrivacy}
          onChange={handleChange}
          className="h-4 w-4 rounded text-indigo-600"
        />
        <label htmlFor="consentPrivacy" className="ml-2 block text-sm text-gray-700">
          {t("consentLabel")} <span className="text-red-500">*</span>
        </label>
      </div>
      {fieldErrors.consentPrivacy && (
        <p className="text-sm text-red-500">{fieldErrors.consentPrivacy}</p>
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
