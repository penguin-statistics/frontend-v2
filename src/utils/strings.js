import I18n from "@/i18n"
import Console from "@/utils/Console";

function getLocaleMessage(object, localeKey, key, language) {
  return object[localeKey][language] || object[localeKey][I18n.fallbackLocale] || object[key] || "";
}

function translate (object, key) {
  let locale = I18n.locale;
  let localeKey = `${key}_i18n`;
  // Console.debug(`generating translation. locale-${locale} key-${localeKey} [${key}]`, object)
  if (object) {
    if (object[localeKey]) {
      if (object[localeKey][locale]) {
        return getLocaleMessage(object, localeKey, key, locale)
      } else {
        let languages = locale.split("-");
        if (languages.length <= 2 && languages[0] !== "") {
          return getLocaleMessage(object, localeKey, key, languages[0])
        } else {
          Console.debug(`translation error: ${key}: Specific country code detected but it's invalid`, locale, languages)
          return ""
        }
      }
    } else {
      return object[key] || ""
    }
  } else {
    return ""
  }
}

// from https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference

function getFirstBrowserLanguageWithRegionCode() {
  let nav = window.navigator,
    browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
    i,
    language,
    len,
    shortLanguage = null;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {
    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      len = language.length;
      if (!shortLanguage && len) {
        shortLanguage = language;
      }
      if (language && len>2) {
        return language;
      }
    }
  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    //skip this loop iteration if property is null/undefined.  IE11 fix.
    if (language == null) { continue; }
    len = language.length;
    if (!shortLanguage && len) {
      shortLanguage = language;
    }
    if (language && len > 2) {
      return language;
    }
  }

  return shortLanguage;
}

function getFirstBrowserLanguage () {
  const language = getFirstBrowserLanguageWithRegionCode().replace("_", "-");
  if (!language) return I18n.fallbackLocale; // use default
  const languages = language.split("-");
  if (languages.length === 1) {
    return language
  } else if (languages.length === 2) {
    return languages[0]
  } else {
    // probably malformed...
    return language
  }
}

export default {translate, getFirstBrowserLanguage}