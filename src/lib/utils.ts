import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function simulateFailure(rate = 0.15) {
  if (Math.random() < rate) {
    const err = new Error("Simulated API failure");
    // Attach a lightweight code so UI can branch on it if needed
    (err as any).code = "SIM_FAIL";
    throw err;
  }
}
