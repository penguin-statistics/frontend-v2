// "use strict";
//
// if (!Object.entries)
//   Object.entries = function( obj ){
//     var ownProps = Object.keys( obj ),
//       i = ownProps.length,
//       resArray = new Array(i); // preallocate the Array
//     while (i--)
//       resArray[i] = [ownProps[i], obj[ownProps[i]]];
//
//     return resArray;
//   };
//
// let _i18n = {
//   languageWithRegion () {
//     let nav = window.navigator,
//       browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
//       i,
//       language,
//       len,
//       shortLanguage = null;
//
//     // support for HTML 5.1 "navigator.languages"
//     if (Array.isArray(nav.languages)) {
//       for (i = 0; i < nav.languages.length; i++) {
//         language = nav.languages[i];
//         len = language.length;
//         if (!shortLanguage && len) {
//           shortLanguage = language;
//         }
//         if (language && len>2) {
//           return language;
//         }
//       }
//     }
//
//     // support for other well known properties in browsers
//     for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
//       language = nav[browserLanguagePropertyKeys[i]];
//       //skip this loop iteration if property is null/undefined.  IE11 fix.
//       if (language == null) { continue; }
//       len = language.length;
//       if (!shortLanguage && len) {
//         shortLanguage = language;
//       }
//       if (language && len > 2) {
//         return language;
//       }
//     }
//
//     return shortLanguage;
//   },
//   language () {
//     if (localStorage) {
//       const settings = localStorage.getItem("penguin-stats-settings")
//       if (settings) {
//         try {
//           const data = JSON.parse(settings);
//           return data.settings.language
//         } catch (e) {
//           // fallback
//           return "en"
//         }
//       }
//     }
//     const language = this.languageWithRegion().replace("_", "-");
//     if (!language) return "en"; // use default
//     const languages = language.split("-");
//     if (languages.length === 1) {
//       return language
//     } else if (languages.length === 2) {
//       return languages[0]
//     } else {
//       // probably malformed...
//       return "en"
//     }
//   },
//   data: {
//     "en": {
//       "load_title--text": "Loading",
//       "load_caption--text": "Initialization may take some time",
//       "load_copyright--text": "Penguin Statistics"
//     },
//     "ja": {
//       "load_title--text": "読み込み中...",
//       "load_caption--text": "初めての読み込みは動作が遅くなる可能性があります<br>少々お待ち下さい",
//       "load_copyright--text": "ペンギン急便データ統計処理部門"
//     },
//     "ko": {
//       "load_title--text": "로딩중...",
//       "load_caption--text": "초기 설정에 시간이 좀 걸릴 수 있으니, 기다려 주시기 바랍니다",
//       "load_copyright--text": "펭귄 물류 데이터 분석 부서"
//     },
//   },
//   fill (key, content) {
//     document.getElementById(key).innerHTML = content;
//   },
//   render () {
//     document.querySelector("#p-loader__footer--year").textContent = new Date().getFullYear().toString();
//     let language = this.language();
//     if (language in this.data && typeof language === "string" && language.length <= 2) {
//       let messages = this.data[language];
//       for (let [key, value] of Object.entries(messages)) {
//         this.fill(key, value)
//       }
//     }
//   }
// };
//
// try {
//   _i18n.render()
// } catch (e) {
//   console.error(e)
// }