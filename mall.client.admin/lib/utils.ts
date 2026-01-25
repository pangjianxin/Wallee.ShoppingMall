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

export const getDiscountText = (value: number | undefined) => {
  if (!value) return "未设置";
  if (value === 1) return "不打折";
  const discount = (value * 10).toFixed(2);
  return `${discount}折`;
};

export const getCurrencySymbol = (currency?: string | null) => {
  if (!currency) return "¥";
  const normalized = currency.toUpperCase();
  switch (normalized) {
    case "CNY":
    case "RMB":
      return "¥";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "HKD":
      return "HK$";
    case "TWD":
      return "NT$";
    case "KRW":
      return "₩";
    default:
      return currency;
  }
};

export const formatMoney = (
  value?: number | null,
  currency?: string | null,
) => {
  if (value === undefined || value === null) return "-";
  return `${getCurrencySymbol(currency)}${value.toFixed(2)}`;
};
