import { Constants } from "@/integrations/supabase/types";

export type CategoryKey =
  | "creative"
  | "training"
  | "financial-aid"
  | "promotions"
  | "partnerships"
  | "contact";

export type Field = { key: string; label: string; long?: boolean; kind?: "bool" | "money" | "list" };

export type Category = {
  key: CategoryKey;
  label: string;
  table:
    | "creative_inquiries"
    | "training_applications"
    | "financial_aid_applications"
    | "promotion_submissions"
    | "partnership_inquiries"
    | "contact_messages";
  /** Allowed statuses, taken from the database enum so the UI never invents one. */
  statuses: readonly string[];
  nameKey: string;
  subtitleKey: string;
  /** Optional column offered as a secondary filter. */
  filterKey?: string;
  filterLabel?: string;
  hasNotes: boolean;
  fields: Field[];
};

const E = Constants.public.Enums;

export const CATEGORIES: Category[] = [
  {
    key: "creative", label: "Creative inquiries", table: "creative_inquiries", statuses: E.inquiry_status,
    nameKey: "name", subtitleKey: "service", filterKey: "service", filterLabel: "Service", hasNotes: true,
    fields: [
      { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "organization", label: "Organization" },
      { key: "service", label: "Service" }, { key: "budget", label: "Budget" }, { key: "details", label: "Details", long: true },
    ],
  },
  {
    key: "training", label: "Training applications", table: "training_applications", statuses: E.training_status,
    nameKey: "full_name", subtitleKey: "program_name", filterKey: "program_name", filterLabel: "Program", hasNotes: true,
    fields: [
      { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "county", label: "County" },
      { key: "program_name", label: "Program" }, { key: "requests_financial_aid", label: "Requests financial aid", kind: "bool" },
      { key: "motivation", label: "Motivation", long: true },
    ],
  },
  {
    key: "financial-aid", label: "Financial-aid applications", table: "financial_aid_applications", statuses: E.aid_status,
    nameKey: "full_name", subtitleKey: "email", hasNotes: true,
    fields: [
      { key: "email", label: "Email" }, { key: "amount_requested_lrd", label: "Amount requested", kind: "money" },
      { key: "amount_awarded_lrd", label: "Amount awarded", kind: "money" },
      { key: "household_situation", label: "Household situation", long: true }, { key: "essay", label: "Essay", long: true },
      { key: "document_paths", label: "Documents", kind: "list" },
    ],
  },
  {
    key: "promotions", label: "Promotion submissions", table: "promotion_submissions", statuses: E.promotion_status,
    nameKey: "title", subtitleKey: "name", filterKey: "promo_type", filterLabel: "Type", hasNotes: true,
    fields: [
      { key: "name", label: "Submitted by" }, { key: "email", label: "Email" }, { key: "promo_type", label: "Type" },
      { key: "link", label: "Link" }, { key: "details", label: "Details", long: true },
    ],
  },
  {
    key: "partnerships", label: "Partnership inquiries", table: "partnership_inquiries", statuses: E.inquiry_status,
    nameKey: "name", subtitleKey: "organization", filterKey: "inquiry_type", filterLabel: "Type", hasNotes: true,
    fields: [
      { key: "inquiry_type", label: "Type" }, { key: "email", label: "Email" }, { key: "organization", label: "Organization" },
      { key: "message", label: "Message", long: true },
    ],
  },
  {
    key: "contact", label: "Contact messages", table: "contact_messages", statuses: E.inquiry_status,
    nameKey: "name", subtitleKey: "topic", filterKey: "topic", filterLabel: "Topic", hasNotes: false,
    fields: [{ key: "email", label: "Email" }, { key: "topic", label: "Topic" }, { key: "message", label: "Message", long: true }],
  },
];

export function getCategory(key: string): Category | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/** Decide where a visitor to the admin area goes. Admin status must come from the database (is_admin()). */
export function resolveAdminAccess(hasUser: boolean, isAdmin: boolean): "login" | "denied" | "ok" {
  if (!hasUser) return "login";
  return isAdmin ? "ok" : "denied";
}
