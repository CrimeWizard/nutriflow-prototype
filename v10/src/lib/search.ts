export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesQuery(query: string, ...parts: (string | undefined)[]): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;
  return parts.some((p) => p?.toLowerCase().includes(q));
}
