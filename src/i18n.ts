export type Locale = "en" | "uk";

export const translations: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    fetch: string;
    loading: string;
    releaseMessageLabel: string;
    copy: string;
    copied: string;
    preferences: string;
    close: string;
    language: string;
    languageEn: string;
    languageUk: string;
  }
> = {
  en: {
    title: "Jira Discord Release",
    subtitle: "Enter Jira ticket keys (e.g. PROJ-1, PROJ-2)",
    placeholder: "PROJ-1, PROJ-2, ...",
    fetch: "Fetch",
    loading: "...",
    releaseMessageLabel: "Release message for Discord",
    copy: "Copy",
    copied: "Copied!",
    preferences: "Preferences",
    close: "Close",
    language: "Language",
    languageEn: "English",
    languageUk: "Ukrainian",
  },
  uk: {
    title: "Jira Discord Release",
    subtitle: "Введіть ключі тікетів Jira (наприклад PROJ-1, PROJ-2)",
    placeholder: "PROJ-1, PROJ-2, ...",
    fetch: "Отримати",
    loading: "...",
    releaseMessageLabel: "Реліз-повідомлення для Discord",
    copy: "Копіювати",
    copied: "Скопійовано!",
    preferences: "Налаштування",
    close: "Закрити",
    language: "Мова",
    languageEn: "English",
    languageUk: "Українська",
  },
};

const STORAGE_KEY = "jira-discord-release-locale";

export function getStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "uk") return v;
  } catch {
    // ignore
  }
  return "en";
}

export function setStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
