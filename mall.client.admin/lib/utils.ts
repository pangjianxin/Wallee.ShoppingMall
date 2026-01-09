import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatJSON(jsonString: string | undefined): string {
  try {
    if (!jsonString) return "";
    const parsedJSON = JSON.parse(jsonString);
    return JSON.stringify(parsedJSON, null, 2);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return jsonString ?? ""; // 如果解析失败，返回原始字符串
  }
}
