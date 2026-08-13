/** An ISO 8601 timestamp string, e.g. `2026-08-13T09:24:00.000Z`. */
export type IsoDateString = string;

/** Every persisted Criation entity carries these fields. */
export interface Entity {
  id: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

/** Amount stored in the smallest currency unit (paise, cents). */
export interface Money {
  /** Integer amount in the currency's minor unit. */
  amount: number;
  /** ISO 4217 code, e.g. `INR`. */
  currency: string;
}

export interface Image {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Recursively marks every property optional — handy for patch payloads. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Makes the listed keys optional while leaving the rest untouched. */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Shape accepted when creating an entity: server owns id and timestamps. */
export type CreateInput<T extends Entity> = Omit<T, keyof Entity>;

/** Shape accepted when updating an entity. */
export type UpdateInput<T extends Entity> = Partial<CreateInput<T>>;
