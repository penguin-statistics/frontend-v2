import dayjs from 'dayjs'
import Console from '@/utils/Console'
import { mapGetters } from 'vuex'
import helmet from "@/utils/helmet";
import { service } from '../utils/service';
import i18n from '../i18n';

const fetchWithTimeout = (url, options, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
};

const fetchTranslations = async (languageKey) => {
  const projectPublishableToken = "52e5ff4b225147a9b11bb63865b2ae1f";
  const environment = "_latest";
  const url = `https://cdn.simplelocalize.io/${projectPublishableToken}/${environment}/${languageKey}`;

  return fetchWithTimeout(url, null, 10e3).then((data) => {
    if (!data.ok || data.status !== 200) {
      throw new Error(data.statusText);
    }
    return data.json();
  });
};

const loadedLanguages = [];

const languageMapping = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
}

function changeLocale (localeId, save) {
  dayjs.locale(localeId);
  Console.info("i18n", "locale:", localeId, "| saving to vuex:", save);
  if (save) this.$store.commit("settings/changeLocale", localeId);
  service.defaults.headers.common["Accept-Language"] = localeId;
  this.$i18n.locale = localeId;
  this.$vuetify.lang.current = localeId;
  helmet.title.update(this.$route);
  document.documentElement.lang = localeId;
}

export function loadLanguageAsync(lang) {
  const mappedLang = languageMapping[lang] || lang;

  // If the language was already loaded
  if (loadedLanguages.includes(mappedLang)) return Promise.resolve();

  // If the language hasn't been loaded yet
  // set it first to use the local translation
  changeLocale.bind(this)(lang, false);

  return fetchTranslations(mappedLang).then((messages) => {
    const transformedMessages = Object.freeze(messages);
    Console.info("i18n", "loaded", lang, "translations:", transformedMessages);
    i18n.setLocaleMessage(lang, transformedMessages);
    loadedLanguages.push(mappedLang);

    return Promise.resolve();
  });
}

export default {
  methods: {
    async changeLocale (localeId, save = true) {
      await loadLanguageAsync.bind(this)(localeId)

      changeLocale.bind(this)(localeId, save);
    }
  },
  computed: {
    ...mapGetters('settings', ['language'])
  }
}
