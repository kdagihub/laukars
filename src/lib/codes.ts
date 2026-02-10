import { nanoid } from "nanoid";

/**
 * Generate Code A (visit code) - given to client at lead creation
 * Format: LK-XXXXXX (6 alphanumeric chars)
 */
export function generateCodeA(): string {
  return `LK-${nanoid(6).toUpperCase()}`;
}

/**
 * Generate Code B (closure code) - given to client after appointment is set
 * Format: LKV-XXXXXXXX (8 alphanumeric chars)
 */
export function generateCodeB(): string {
  return `LKV-${nanoid(8).toUpperCase()}`;
}

/**
 * Generate vehicle fingerprint for anti-duplicate detection
 */
export function generateFingerprint(
  brand: string,
  model: string,
  year: number,
  mileage: number,
  supplierPhone?: string
): string {
  const normalized = [
    brand.toLowerCase().trim(),
    model.toLowerCase().trim(),
    year.toString(),
    mileage.toString(),
    supplierPhone?.trim() || "",
  ].join("|");

  return normalized;
}
