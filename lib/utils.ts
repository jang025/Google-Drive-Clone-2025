import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// whenever you pass large payloads through server actions , you first have to stringify then parse
export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};
