import type { Holding } from "@/shared/types";

export async function fetchHoldings(): Promise<Holding[]> {
  const res = await fetch("/api/portfolio", { method: "GET" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load portfolio");
  }

  const holdings = (data?.holdings ?? []) as Holding[];
  return holdings.filter((h) => h.quantity > 0);
}
