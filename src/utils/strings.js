import I18n from "@/i18n"
import Console from "@/utils/Console";

function translate (object, key) {
  let locale = I18n.locale;
  let localeKey = `${key}_i18n`;
  // Console.debug(`generating translation. locale-${locale} key-${localeKey} [${key}]`, object)
  if (object) {
    if (object[localeKey]) {
      if (object[localeKey][locale]) {
        return object[localeKey][locale] || ""
      } else {
        let languages = locale.split("_")
        if (languages.length === 2 && languages[0] !== "") {
          return object[localeKey][languages[0]] || "";
        } else {
          Console.debug(`translation error: ${key}: Specific country code detected but no translation message is matching it.`)
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

export default {translate}