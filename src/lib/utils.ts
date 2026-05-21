import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind classes safely, resolving conflicts (e.g. p-2 + p-4 → p-4).
 * Required by all shadcn/ui components via the `cn` import pattern.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
