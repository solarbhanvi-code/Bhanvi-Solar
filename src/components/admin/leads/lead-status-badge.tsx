import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { LeadStatus } from "@/types";

const STATUS_VARIANT: Record<LeadStatus, BadgeProps["variant"]> = {
  NEW: "solar",
  CONTACTED: "default",
  QUALIFIED: "default",
  SITE_VISIT: "default",
  QUOTATION_SENT: "energy",
  WON: "energy",
  LOST: "destructive",
};

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "SITE_VISIT",
  "QUOTATION_SENT",
  "WON",
  "LOST",
];

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status.replace("_", " ")}</Badge>;
}
