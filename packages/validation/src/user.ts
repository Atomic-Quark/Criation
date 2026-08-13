import { z } from "zod";

import { entityTimestampsSchema } from "./common";

export const userRoleSchema = z.enum(["customer", "staff", "admin"]);

export const emailSchema = z
  .email("Enter a valid email address")
  .transform((value) => value.trim().toLowerCase());

/** At least 8 characters with a letter and a number. */
export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(128, "Use at most 128 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number");

export const userSchema = entityTimestampsSchema.extend({
  email: emailSchema,
  name: z.string().min(1, "Name is required").max(120),
  role: userRoleSchema,
  avatarUrl: z.url().nullable().optional(),
  emailVerified: z.boolean().default(false),
});

export const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(3, "Postal code is required").max(12),
  country: z
    .string()
    .length(2, "Use a 2-letter ISO country code")
    .transform((value) => value.toUpperCase()),
});

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CredentialsInput = z.input<typeof credentialsSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
