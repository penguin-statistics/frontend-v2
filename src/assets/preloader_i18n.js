"use strict";

let _i18n = {
  getFirstBrowserLanguageWithRegionCode () {
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
  },
  getFirstBrowserLanguage () {
    const language = this.getFirstBrowserLanguageWithRegionCode().replace("_", "-");
    if (!language) return "zh"; // use default
    const languages = language.split("-");
    if (languages.length === 1) {
      return language
    } else if (languages.length === 2) {
      return languages[0]
    } else {
      // probably malformed...
      return language
    }
  },
  data: {
    "en": {
      "load_title--text": "Loading...",
      "load_caption--text": "Initialization may take some time",
      "load_copyright--text": "Penguin Statistics"
    },
    "ja": {
      "load_title--text": "読み込み中...",
      "load_caption--text": "読み込みが初めて遅くなる場合があります<br>しばらくお待ちください",
      "load_copyright--text": "ペンギン急便データ統計処理部門"
    },
    "ko": {
      "load_title--text": "로딩...",
      "load_caption--text": "처음으로 로딩이 느려질 수 있으므로 잠시 기다려주십시오",
      "load_copyright--text": "펭귄 물류 데이터 분석 부서"
    },
  },
  fill (key, content) {
    document.querySelector("#" + key).innerHTML = content;
  },
  render () {
    document.querySelector("#load_copyright_year--text").textContent = new Date().getFullYear().toString();
    let language = this.getFirstBrowserLanguage();
    if (language in this.data && typeof language === "string" && language.length <= 2) {
      let messages = this.data[language];
      for (let [key, value] of Object.entries(messages)) {
        this.fill(key, value)
      }
    }
  }
};

try {
  _i18n.render()
} catch (e) {
  console.error(e)
}