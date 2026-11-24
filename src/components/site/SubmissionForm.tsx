import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkbox";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  maxLength?: number;
  /** Maps the select option label to the database value. */
  optionValues?: Record<string, string>;
  /** When set, the mapped value is converted to a boolean (for boolean columns). */
  booleanField?: boolean;
  placeholder?: string;
};

type SubmissionFormProps = {
  table: string;
  fields: Field[];
  submitLabel: string;
  /** Map form field names to the database column names when they differ. */
  fieldMap?: Record<string, string>;
  /** Extra values to insert that aren't form fields (e.g. topic for contact). */
  staticValues?: Record<string, string | boolean>;
  successMessage?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function SubmissionForm({
  table,
  fields,
  submitLabel,
  fieldMap = {},
  staticValues = {},
  successMessage = "Your submission has been received. We will be in touch.",
}: SubmissionFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(data: Record<string, string | boolean>): boolean {
    const errors: Record<string, string> = {};
    for (const f of fields) {
      if (f.required) {
        const val = data[f.name];
        if (f.type === "checkbox") {
          if (val !== true) errors[f.name] = "This must be confirmed to continue.";
        } else if (!String(val ?? "").trim()) {
          errors[f.name] = `${f.label} is required.`;
        }
      }
      if (f.type === "email" && data[f.name]) {
        const email = String(data[f.name]);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors[f.name] = "Please enter a valid email address.";
        }
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string | boolean> = {};

    for (const f of fields) {
      if (f.type === "checkbox") {
        data[f.name] = formData.get(f.name) === "on";
      } else {
        const raw = formData.get(f.name);
        data[f.name] = raw != null ? String(raw).trim() : "";
      }
    }

    if (!validate(data)) {
      setStatus("idle");
      return;
    }

    // Map form fields to database columns
    const row: Record<string, string | boolean | null> = {};
    for (const f of fields) {
      const dbCol = fieldMap[f.name] ?? f.name;
      let value: string | boolean = data[f.name];

      // Map select option labels to DB values
      if (f.type === "select" && f.optionValues && typeof value === "string") {
        value = f.optionValues[value] ?? value;
      }

      // Convert string to boolean for boolean columns
      if (f.booleanField && typeof value === "string") {
        row[dbCol] = value === "true";
      } else if (typeof value === "string" && !value && !f.required) {
        // Convert empty optional strings to null
        row[dbCol] = null;
      } else {
        row[dbCol] = value;
      }
    }

    // Add static values
    for (const [key, val] of Object.entries(staticValues)) {
      row[key] = val;
    }

    const { error: insertError } = await supabase.from(table).insert(row).select();

    if (insertError) {
      setStatus("error");
      setError("Something went wrong while submitting. Please try again or email us directly.");
      return;
    }

    setStatus("success");
    e.currentTarget.reset();
  }

  if (status === "success") {
    return (
      <div className="max-w-2xl">
        <div className="border-l-2 border-primary bg-muted px-5 py-4 text-sm">
          {successMessage}
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 border border-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background"
        >
          Submit another
        </button>
      </div>
    );
  }

  const cls =
    "mt-2 w-full border border-input bg-card px-3 py-2.5 text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-5" noValidate>
      {fields.map((f) => {
        const fe = fieldErrors[f.name];
        const errorId = `error-${f.name}`;
        return (
          <label key={f.name} className="text-sm font-medium">
            {f.type === "checkbox" ? (
              <span className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name={f.name}
                  required={f.required}
                  className="mt-1 h-4 w-4 border border-input accent-primary"
                  aria-invalid={!!fe}
                  aria-describedby={fe ? errorId : undefined}
                />
                <span>
                  {f.label}{f.required && <span className="text-primary"> *</span>}
                </span>
              </span>
            ) : (
              <>
                {f.label}{f.required && <span className="text-primary"> *</span>}
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    required={f.required}
                    maxLength={f.maxLength ?? 2000}
                    rows={5}
                    className={cls}
                    placeholder={f.placeholder}
                    aria-invalid={!!fe}
                    aria-describedby={fe ? errorId : undefined}
                  />
                ) : f.type === "select" ? (
                  <select
                    name={f.name}
                    required={f.required}
                    className={cls}
                    defaultValue=""
                    aria-invalid={!!fe}
                    aria-describedby={fe ? errorId : undefined}
                  >
                    <option value="" disabled>Select…</option>
                    {f.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    name={f.name}
                    type={f.type ?? "text"}
                    required={f.required}
                    maxLength={f.maxLength ?? 200}
                    className={cls}
                    placeholder={f.placeholder}
                    aria-invalid={!!fe}
                    aria-describedby={fe ? errorId : undefined}
                  />
                )}
              </>
            )}
            {fe && (
              <p id={errorId} className="mt-1 text-sm text-primary" role="alert">{fe}</p>
            )}
          </label>
        );
      })}
      {error && <p className="text-sm text-primary" role="alert">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// Re-export shared layout primitives that forms compose with
export { PageHero, Section, Grid, StatusTag, CTA, Notice } from "./blocks";
export type { ReactNode };
