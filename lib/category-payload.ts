import { z } from "zod";

export const categoryPayloadSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  applyDeliveryCharge: z.boolean().optional().default(true),
  deliveryFee: z
    .union([z.number().min(0), z.string(), z.null()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) && n >= 0 ? n : null;
    }),
});

export type CategoryPayload = z.infer<typeof categoryPayloadSchema>;

export function categoryValuesForDb(data: CategoryPayload & { slug: string }) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    image: data.image ?? null,
    applyDeliveryCharge: data.applyDeliveryCharge ?? true,
    deliveryFee:
      data.applyDeliveryCharge && data.deliveryFee != null
        ? data.deliveryFee.toFixed(2)
        : null,
  };
}
