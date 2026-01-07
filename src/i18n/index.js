import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJSON from './locales/en.json'
import arJSON from './locales/ar.json'

i18n.use(initReactI18next).init(({
    resources: {
        en: { ...enJSON },
        ar: { ...arJSON }
    },
    lng: localStorage.getItem("accept-language") || "ar",
    interpolation: {
        escapeValue: false,
    },
}))