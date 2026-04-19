export const supportedLangs = ["en", "hi", "od"] as const;
export type Lang = (typeof supportedLangs)[number];

export function isValidLang(lang: string): lang is Lang {
  return supportedLangs.includes(lang as Lang);
}