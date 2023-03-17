import dayjs from "dayjs";
import Console from "@/utils/Console";
import {mapGetters} from "vuex";
import helmet from "@/utils/helmet";
import {externalService, service} from "../utils/service";
import i18n from "../i18n";
import {transformMessages} from "@/utils/i18n";
// import environment from "../utils/environment";

const fetchTranslations = async (languageKey) => {
  const projectPublishableToken = "52e5ff4b225147a9b11bb63865b2ae1f";
  const environment = "_latest";
  const url = `https://cdn.simplelocalize.io/${projectPublishableToken}/${environment}/${languageKey}`;

  return externalService
    .get(url, {
      timeout: 10e3,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Console.error("i18n", "failed to fetch translations:", error);
      return {};
    });
};

const loadedLanguages = [];

const languageMapping = {
  en: "en_US",
  zh: "zh_CN",
  ja: "ja_JP",
  ko: "ko_KR",
};

const localeMapping = {
  en_US: "en",
  zh_CN: "zh",
  ja_JP: "ja",
  ko_KR: "ko",
  zh_CN_x_seaborn: "zh",
  ja_JP_x_seaborn: "ja",
  ko_KR_x_seaborn: "ko",
  en_US_x_seaborn: "en",
}

const fontMapping = {
  en: {
    fontFamily: "Noto Serif",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif/400.css"),
      import(
        /* webpackChunkName: "font-noto-serif" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif/700.css"),
    ],
  },
  zh: {
    fontFamily: "Noto Serif SC",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-sc" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-sc/400.css"),
      import(
        /* webpackChunkName: "font-noto-serif-sc" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-sc/700.css"),
    ],
  },
  ja: {
    fontFamily: "Noto Serif JP",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-jp" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-jp/400.css"),
      import(
        /* webpackChunkName: "font-noto-serif-jp" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-jp/700.css"),
    ],
  },
  ko: {
    fontFamily: "Noto Serif KR",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-kr" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-kr/400.css"),
      import(
        /* webpackChunkName: "font-noto-serif-kr" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "@fontsource/noto-serif-kr/700.css"),
    ],
  }
}

function changeLocale(localeId, save) {
  dayjs.locale(localeId);
  Console.info("i18n", "locale:", localeId, "| saving to vuex:", save);
  if (save) this.$store.commit("settings/changeLocale", localeId);
  service.defaults.headers.common["Accept-Language"] = localeId;
  this.$i18n.locale = localeId;
  this.$vuetify.lang.current = localeMapping[localeId] || localeId;
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
  // import font using fontsource.
  const font = fontMapping[lang];
  if (font) {
    font.fontSource()
  }

  // if (environment.production) {
  return fetchTranslations(mappedLang).then((messages) => {
    const transformedMessages = Object.freeze(transformMessages(messages));
    Console.info("i18n", "fetched", lang, "translations:", transformedMessages);
    i18n.setLocaleMessage(lang, transformedMessages);
    loadedLanguages.push(mappedLang);

    return Promise.resolve();
  });
  // }
}

export default {
  methods: {
    async changeLocale(localeId, save = true) {
      const lang = (() => {
        const splitted = localeId.split("-")
        if (splitted.length > 1) {
          return splitted[0]
        } else {
          return localeId
        }
      })()
      await loadLanguageAsync.bind(this)(lang);

      changeLocale.bind(this)(lang, save);
    },
  },
  computed: {
    ...mapGetters("settings", ["language"]),
  },
};
