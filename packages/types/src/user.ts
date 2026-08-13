import type { Entity } from "./common";

export const UserRole = {
  Customer: "customer",
  Staff: "staff",
  Admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User extends Entity {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  emailVerified: boolean;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
}

export interface Session {
  user: User;
  accessToken: string;
  /** Unix epoch milliseconds at which `accessToken` stops being valid. */
  expiresAt: number;
}

export interface Credentials {
  email: string;
  password: string;
}
