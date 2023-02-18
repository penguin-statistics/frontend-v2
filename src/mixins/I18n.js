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
  en: "en",
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

// messages are in the form of Record<string, string>.
// if the key of the message contains `path1.path2`, it should be converted to a corresponding object
// similarly, if the key of the message contains `path1.path2[number]`, it should be converted to a corresponding object with an array
// e.g. { 'path1.path2': 'value', 'path1.path3[0]': 'value1', 'path1.path3[1]': 'value2' } should be converted to { path1: { path2: 'value', path3: ['value1', 'value2'] } }
function transformMessages (messages) {
  const transformedMessages = {};
  Object.keys(messages).forEach((key) => {
    const path = key.split('.');
    let current = transformedMessages;
    for (let i = 0; i < path.length; i++) {
      const pathPart = path[i];
      if (pathPart.endsWith(']')) {
        // array
        const arrayPath = pathPart.split('[');
        const arrayName = arrayPath[0];
        const arrayIndex = parseInt(arrayPath[1].replace(']', ''));
        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        if (i === path.length - 1) { // last part of the path
          current[arrayName][arrayIndex] = messages[key] || undefined;
        } else {
          if (!current[arrayName][arrayIndex]) {
            current[arrayName][arrayIndex] = {};
          }
          current = current[arrayName][arrayIndex];
        }
      } else {
        // object
        if (i === path.length - 1) { // last part
          current[pathPart] = messages[key] || undefined
        } else {
          if (!current[pathPart]) {
            current[pathPart] = {};
          }
          current = current[pathPart];
        }
      }
    }
  });
  return transformedMessages;
}

export function loadLanguageAsync(lang) {
  const mappedLang = languageMapping[lang] || lang;

  // If the language was already loaded
  if (loadedLanguages.includes(mappedLang)) return Promise.resolve();

  // If the language hasn't been loaded yet
  // set it first to use the local translation
  changeLocale.bind(this)(lang, false);

  return fetchTranslations(mappedLang).then((messages) => {
    const transformedMessages = Object.freeze(transformMessages(messages));
    Console.info("i18n", "loaded", lang, "translations:", transformedMessages);
    i18n.setLocaleMessage(lang, transformedMessages);
    loadedLanguages.push(mappedLang);

    return Promise.resolve();
  });
}

export default {
  methods: {
    async changeLocale (localeId, save = true) {
      // await loadLanguageAsync.bind(this)(localeId)

      changeLocale.bind(this)(localeId, save);
    }
  },
  computed: {
    ...mapGetters('settings', ['language'])
  }
}
