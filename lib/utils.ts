import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Deeply clones a value using JSON.stringify and JSON.parse.
 *
 * Note that this will only work on objects that can be serialized to JSON.
 * If you need to clone a value that contains functions, symbols, or other
 * values that cannot be serialized to JSON, you may need to use a different
 * approach.
 *
 * @example
 * const original = { a: 1, b: 2 };
 * const clone = parseStringify(original);
 * original !== clone; // true
 * original.a = 3;
 * clone.a; // 1
 */
export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));
