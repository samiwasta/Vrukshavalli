export const FEW_LEFT_THRESHOLD = 10;

export const LOW_STOCK_RATIO = 0.25;

export type StockLevel = "out" | "few" | "in";

export function getStockLevel(
  stock: number,
  capacity?: number | null
): StockLevel {
  if (stock <= 0) return "out";
  const cap = capacity != null && capacity > 0 ? capacity : null;
  if (cap != null) {
    const ratio = stock / cap;
    if (ratio < LOW_STOCK_RATIO) return "few";
    return "in";
  }
  return "in";
}

export function stockStatusLabel(
  stock: number,
  capacity?: number | null
): string {
  const level = getStockLevel(stock, capacity);
  if (level === "out") return "Out of stock";
  if (level === "few") return "Few left";
  return "In stock";
}

export function adminStockDisplay(stock: number, capacity: number | null | undefined) {
  const stockOut = stock <= 0;
  const cap = capacity != null && capacity > 0 ? capacity : null;
  const hasCapacity = cap != null;
  const ratio = hasCapacity && cap ? stock / cap : null;
  const overCapacity =
    !stockOut && hasCapacity && cap != null && stock > cap;
  const stockLow =
    !stockOut &&
    !overCapacity &&
    hasCapacity &&
    ratio !== null &&
    ratio < LOW_STOCK_RATIO;
  const fillPct = hasCapacity && cap
    ? Math.min(100, (stock / cap) * 100)
    : stockOut
      ? 0
      : 100;
  return {
    stockOut,
    stockLow,
    fillPct,
    hasCapacity,
    ratio,
    cap,
    overCapacity,
  };
}
