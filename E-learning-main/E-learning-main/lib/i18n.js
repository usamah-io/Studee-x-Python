"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import idTranslation from "../locales/id.json";

// Helper function to safely check for localStorage in Next.js SSR environment
const getSavedLanguage = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("studee_language") || "id";
  }
  return "id";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      id: { translation: idTranslation }
    },
    lng: getSavedLanguage(),
    fallbackLng: "id",
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;
