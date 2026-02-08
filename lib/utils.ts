import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate serial number in format: PCMBD-YYYY-XXXX-YYYY
export function generateSerialNumber(): string {
  const year = new Date().getFullYear()
  const random1 = Math.random().toString(36).substring(2, 6).toUpperCase()
  const random2 = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PCMBD-${year}-${random1}-${random2}`
}

// Validate serial number format
export function isValidSerialFormat(serial: string): boolean {
  // Allow alphanumeric and hyphens, 3 to 30 chars
  // Examples: T5415, PCMBD-2024-XXXX-YYYY, A7878-X
  const pattern = /^[A-Za-z0-9\-]{3,30}$/
  return pattern.test(serial)
}
