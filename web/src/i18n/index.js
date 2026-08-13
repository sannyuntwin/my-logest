import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TRANSLATIONS } from './translations'

export const LANGUAGE_STORAGE_KEY = 'logistics-language'

export function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && TRANSLATIONS[stored]) {
    return stored
  }

  const browserLanguage = window.navigator.language?.slice(0, 2)
  return TRANSLATIONS[browserLanguage] ? browserLanguage : 'en'
}

export function getCopy(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.en
}

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: TRANSLATIONS.en },
      th: { translation: TRANSLATIONS.th },
      my: { translation: TRANSLATIONS.my },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
}

export default i18next
