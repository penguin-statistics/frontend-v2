import dayjs from "dayjs";
import Console from "@/utils/Console";
import {mapGetters} from "vuex";
import helmet from "@/utils/helmet";
import i18n from "@/i18n";
import store from "@/store";
import strings from "@/utils/strings";
import environment from "@/utils/environment";

const loadedLanguages = [];

// whether changeLocale() has been called yet. on boot, the Localization hook only applies the
// preferred locale after the initial route has been resolved
let localeApplied = false;

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
        "../assets/fonts/noto-serif-multilang/noto-serif.css"),
    ],
  },
  zh: {
    fontFamily: "Noto Serif SC",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-sc" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "../assets/fonts/noto-serif-multilang/noto-serif-sc.css"),
    ],
  },
  ja: {
    fontFamily: "Noto Serif JP",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-jp" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "../assets/fonts/noto-serif-multilang/noto-serif-jp.css"),
    ],
  },
  ko: {
    fontFamily: "Noto Serif KR",
    fontSource: () => [
      import(
        /* webpackChunkName: "font-noto-serif-kr" */
        /* webpackPrefetch: false */
        /* webpackPreload: false */
        "../assets/fonts/noto-serif-multilang/noto-serif-kr.css"),
    ],
  }
}

// tells search engines whether to index the page of the route: not if the route is marked noindex, nor in the
// seaborn locales. the robots tags of the page the server rendered are left as the server set them, even in a
// seaborn locale: crawlers never use one, and the server's tags describe the page's data
export function changePageIndexable(route, localeId = activeLocale()) {
  if (helmet.serverRendered(route)) return;
  const indexable = !helmet.noindex(route) && !localeId.includes("_x_seaborn");
  const content = indexable ? "index,follow" : "noindex,follow";
  document.querySelectorAll('meta[name="robots"], meta[name="googlebot"]').forEach((meta) => {
    meta.remove();
  });
  document.head.insertAdjacentHTML(
    "beforeend",
    `<meta name="robots" content="${content}"><meta name="googlebot" content="${content}">`
  );
}

function changeLocale(localeId, save) {
  dayjs.locale(localeId);
  Console.info("i18n", "locale:", localeId, "| saving to vuex:", save);
  if (save) this.$store.commit("settings/changeLocale", localeId);
  // service.defaults.headers.common["Accept-Language"] = localeId;
  // if (localeId.includes("_x_")) {
  //   // if the localeId includes _x_, add X-Robots-Tag header to prevent search engine indexing
  //   document.head.insertAdjacentHTML(
  //     "beforeend",
  //     `<meta name="robots" content="noindex">`
  //   );
  // } else {
  //   // remove the X-Robots-Tag header
  //   const robotsMeta = document.querySelectorAll('meta[name="robots"]');
  //   if (robotsMeta.length > 0) {
  //     robotsMeta.forEach((meta) => {
  //       meta.remove();
  //     });
  //   }
  // }
  changePageIndexable(this.$route, localeId);

  this.$i18n.locale = localeId;
  this.$vuetify.lang.current = localeMapping[localeId] || localeId;
  helmet.localeChanged(this.$route);
  // the seaborn locale ids (e.g. zh_CN_x_seaborn) are not valid language tags: use their base language
  document.documentElement.lang = strings.mapLocale(localeId);
  localeApplied = true;
}

// the active locale or, before the Localization hook ran, the one it is going to apply
export function activeLocale() {
  // always read $i18n.locale so that reactive callers keep tracking it
  const locale = i18n.locale;
  if (localeApplied) return locale;
  const language = store.getters["settings/language"];
  return !language || environment.isAppIOS ? strings.getFirstBrowserLanguage() : language;
}

export function loadLanguageAsync(lang) {
  const mappedLang = languageMapping[lang] || lang;

  // If the language was already loaded
  if (loadedLanguages.includes(mappedLang)) return Promise.resolve();

  // import font using fontsource.
  const font = fontMapping[localeMapping[lang] || lang];
  if (font) {
    font.fontSource()
  }

  return Promise.resolve();
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
      changeLocale.bind(this)(lang, save);

      loadLanguageAsync.bind(this)(lang);
    },
  },
  computed: {
    ...mapGetters("settings", ["language"]),
  },
};
