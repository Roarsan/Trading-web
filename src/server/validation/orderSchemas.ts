import { z } from "zod";

const symbolSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z][A-Z0-9.\-]{0,9}$/.test(value), {
    message: "Invalid symbol",
  });

const quantitySchema = z.preprocess(
  (value) => Number(value),
  z.number().int().positive(),
);

const priceSchema = z.preprocess(
  (value) => Number(value),
  z.number().positive(),
);

export const orderSchema = z.object({
  symbol: symbolSchema,
  quantity: quantitySchema,
  price: priceSchema,
  type: z.enum(["BUY", "SELL"]),
});

export type OrderInput = z.infer<typeof orderSchema>;
