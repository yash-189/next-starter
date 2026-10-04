// Arrays become ?tag=a&tag=b; null and undefined are skipped.
export function serializeParams(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== undefined && item !== null) search.append(key, String(item));
    }
  }
  return search.toString();
}
