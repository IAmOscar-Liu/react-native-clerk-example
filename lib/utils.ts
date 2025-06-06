import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names or conditional class names and resolves Tailwind CSS conflicts
 * @param inputs - Class names to merge (strings, objects, or arrays)
 * @returns Merged class string with resolved Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(err: any): string {
  if (err?.clerkError && Array.isArray(err.errors)) {
    const firstError = err.errors[0];
    return firstError.message || "An unknown error occurred.";
  } else if (err?.merge) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}
