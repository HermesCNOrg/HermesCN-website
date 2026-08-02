"use client";

import { useSyncExternalStore } from "react";

import {
  defaultLocale,
  localeChangeEvent,
  localeCookieName,
  localeStorageKey,
  toIntlLocale,
  type Locale,
} from "./config";

function getLocale() {
  return defaultLocale;
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
