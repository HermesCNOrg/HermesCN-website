"use client";

import { useSyncExternalStore } from "react";

import {
  defaultLocale,
  isLocale,
  localeChangeEvent,
  localeCookieName,
  localeStorageKey,
  toIntlLocale,
  type Locale,
} from "./config";

function getLocale() {
  const stored = window.localStorage.getItem(localeStorageKey);
  return isLocale(stored) ? stored : defaultLocale;
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(localeChangeEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(localeChangeEvent, listener);
  };
}

export function setLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = toIntlLocale(locale);
  window.dispatchEvent(new Event(localeChangeEvent));
}

export function useLocale() {
  return useSyncExternalStore(subscribe, getLocale, () => defaultLocale);
}
