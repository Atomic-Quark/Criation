import { z } from "zod";

export const idSchema = z.string().min(1, "Required");

export const isoDateStringSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Must be a valid ISO 8601 date string",
});

export const currencyCodeSchema = z
  .string()
  .length(3, "Must be a 3-letter ISO 4217 code")
  .transform((value) => value.toUpperCase());

/** An amount in the smallest currency unit: non-negative whole number. */
export const minorAmountSchema = z
  .number()
  .int("Must be a whole number of minor units")
  .nonnegative("Must not be negative");

export const moneySchema = z.object({
  amount: minorAmountSchema,
  currency: currencyCodeSchema,
});

export const imageSchema = z.object({
  url: z.url("Must be a valid URL"),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase, hyphenated slug");

export const entityTimestampsSchema = z.object({
  id: idSchema,
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQueryInput = z.input<typeof paginationQuerySchema>;
export type PaginationQueryOutput = z.output<typeof paginationQuerySchema>;
