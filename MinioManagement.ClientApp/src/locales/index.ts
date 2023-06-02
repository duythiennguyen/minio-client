import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import 'moment/locale/vi';
import 'moment/locale/en-au';
import 'moment/locale/zh-cn';
import { registerLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-GB';
import zh from 'date-fns/locale/zh-CN';

import translationEN from './en.json';
import translationZH from './zh.json';
import translationVI from './vi.json';
import moment from 'moment';

// the translations
const resources = {
  en: translationEN,
  zh: translationZH,
  vi: translationVI,
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: `${localStorage.getItem('language') ? localStorage.getItem('language') : 'vi'}`,
    // debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

switch (localStorage.getItem('language')) {
  case 'vi':
    moment.locale('vi');
    registerLocale('vi', vi);
    break;
  case 'en':
    moment.locale('en-gb');
    registerLocale('en', en);
    break;
  case 'zh':
    moment.locale('zh-cn');
    registerLocale('zh', zh);
    break;
  default:
    moment.locale('vi');
    break;
}

export default i18n;
