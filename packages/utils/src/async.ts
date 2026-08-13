/** Resolves after `ms` milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RetryOptions {
  /** Total number of attempts, including the first one. */
  attempts?: number;
  /** Delay before the first retry, in milliseconds. */
  baseDelayMs?: number;
  /** Multiplier applied to the delay after each failed attempt. */
  factor?: number;
  /** Return false to stop retrying and rethrow immediately. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/** Runs `task`, retrying with exponential backoff when it rejects. */
export async function retry<T>(
  task: () => Promise<T>,
  { attempts = 3, baseDelayMs = 300, factor = 2, shouldRetry = () => true }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === attempts || !shouldRetry(error, attempt)) break;
      await sleep(baseDelayMs * factor ** (attempt - 1));
    }
  }
  throw lastError;
}

/** Rejects with `TimeoutError` if `promise` does not settle within `ms`. */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
