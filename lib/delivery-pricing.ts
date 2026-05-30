/** Bag subtotal after coupon, before GST — at or above this, delivery is free */
export const FREE_DELIVERY_MIN_SUBTOTAL_INR = 999;

/** Default flat delivery when a chargeable category has no custom fee */
export const FLAT_DELIVERY_CHARGE_INR = 129;

export type CategoryDeliverySettings = {
  applyDeliveryCharge: boolean;
  deliveryFee: number | null;
};

export function categoryDeliverySettingsFromRow(row: {
  applyDeliveryCharge?: boolean | null;
  deliveryFee?: string | number | null;
}): CategoryDeliverySettings {
  const rawFee = row.deliveryFee;
  const deliveryFee =
    rawFee === null || rawFee === undefined || rawFee === ""
      ? null
      : Number(rawFee);
  return {
    applyDeliveryCharge: row.applyDeliveryCharge !== false,
    deliveryFee:
      deliveryFee != null && !Number.isNaN(deliveryFee) && deliveryFee >= 0
        ? deliveryFee
        : null,
  };
}

export function buildCategoryDeliveryMap(
  rows: {
    id: string;
    applyDeliveryCharge?: boolean | null;
    deliveryFee?: string | number | null;
  }[],
): Map<string, CategoryDeliverySettings> {
  return new Map(
    rows.map((c) => [c.id, categoryDeliverySettingsFromRow(c)]),
  );
}

/**
 * Shipping for the bag based on categories of items in the cart.
 * Uses the highest applicable fee when multiple chargeable categories are present.
 */
export function computeBagShipping(
  taxableAmount: number,
  categoryIdsInBag: (string | null | undefined)[],
  settingsByCategoryId: Map<string, CategoryDeliverySettings>,
): number {
  if (taxableAmount <= 0) return 0;

  const uniqueIds = [
    ...new Set(categoryIdsInBag.filter((id): id is string => Boolean(id))),
  ];

  if (uniqueIds.length === 0) {
    return taxableAmount >= FREE_DELIVERY_MIN_SUBTOTAL_INR
      ? 0
      : FLAT_DELIVERY_CHARGE_INR;
  }

  const chargeableIds = uniqueIds.filter((id) => {
    const settings = settingsByCategoryId.get(id);
    return settings ? settings.applyDeliveryCharge : true;
  });

  if (chargeableIds.length === 0) return 0;

  if (taxableAmount >= FREE_DELIVERY_MIN_SUBTOTAL_INR) return 0;

  let fee = FLAT_DELIVERY_CHARGE_INR;
  for (const id of chargeableIds) {
    const settings = settingsByCategoryId.get(id);
    const categoryFee =
      settings?.deliveryFee != null && settings.deliveryFee > 0
        ? settings.deliveryFee
        : FLAT_DELIVERY_CHARGE_INR;
    fee = Math.max(fee, categoryFee);
  }
  return fee;
}
