const loader = function () {
  // gradient timeout
  setTimeout(function () {
    document.getElementById("p-loader--gradientel").style.opacity = 1
  }, 750)

  let _i18n = {
    languageWithRegion () {
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
    language () {
      if (localStorage) {
        const settings = localStorage.getItem("penguin-stats-settings")
        if (settings) {
          try {
            const data = JSON.parse(settings);
            return data.settings.language
          } catch (e) {
            // fallback
            return "en"
          }
        }
      }
      const language = this.languageWithRegion().replace("_", "-");
      if (!language) return "en"; // use default
      const languages = language.split("-");
      if (languages.length === 1) {
        return language
      } else if (languages.length === 2) {
        return languages[0]
      } else {
        // probably malformed...
        return "en"
      }
    },
    data: {
      zh: {
        titles: ["正在尝试与 Rhodes Island™ 建立神经连接", "正在释放神经递质", "少女祈祷中", "资源装载中"],
        subtitle: "首次加载可能较慢，请耐心等待",
        vendor: "&copy; 企鹅物流数据统计",
        errors: {
          coreLoad: {
            title: "核心资源加载失败",
            content: `<ul><li>请尝试 <button onclick='__reload()'>重载页面</button></li>
<li>若屡次出现此错误，请<a href="/update-browser.html" target="_blank">升级您的浏览器</a></li></ul>`
          },
          coreExec: {
            title: "核心资源解析失败",
            content: `<p>由于您的浏览器过于过时，页面在渲染时发生了错误。</p><p>请 <a href="/update-browser.html" target="_blank">升级您的浏览器</a></p>`
          },
          slow: {
            title: "加载过于缓慢",
            content: `<p>检测到页面资源加载过于缓慢（加载时长超过 15s）</p><ul><li>请尝试 <button onclick='__reload()'>使用 CN 镜像</button></li>
<li>若持续未响应，请<a href="/update-browser.html" target="_blank">升级您的浏览器</a></li></ul>`
          }
        }
      },
      en: {
        titles: ["Connecting to the neural network of Rhodes Island", "Submitting feedback to the neural network"],
        subtitle: "Initialization may take some time",
        vendor: "&copy; Penguin Statistics",
        errors: {
          coreLoad: {
            title: "Failed to load Essential Resources",
            content: `<ul><li>Please try <button onclick='__reload()'>Reload the Page</button></li>
<li>If this error occurs multiple times, please <a href="/update-browser.html" target="_blank">Upgrade your Browser</a></li></ul>`
          },
          slow: {
            title: "Resources took too long to load",
            content: `<p>An unreasonably length of time has elapsed to load resources on this page (took over 15 seconds)</p><ul><li>Please try <button onclick='__reload()'>Use the CN Mirror</button></li>
<li>If this error occurs multiple times, please <a href="/update-browser.html" target="_blank">Upgrade your Browser</a></li></ul>`
          }
        }
      },
      ja: {
        titles: ["読み込み中..."],
        subtitle: "初めての読み込みは動作が遅くなる可能性があります<br>少々お待ち下さい",
        vendor: "&copy; ペンギン急便データ統計処理部門"
      },
      ko: {
        titles: ["로딩중..."],
        subtitle: "초기 설정에 시간이 좀 걸릴 수 있으니, 기다려 주시기 바랍니다",
        vendor: "&copy; 펭귄 물류 데이터 분석 부서"
      },
    },
    fill (key, content) {
      document.getElementById(key).innerHTML = content;
    },
    render () {
      document.querySelector("#p-loader__footer--year").textContent = new Date().getFullYear().toString();
      const language = this.language();
      const m = this.data[language]
      const titleEl = document.querySelector(".p-loader__title")
      const timers = []

      function getTitle() {
        const shifted = m.titles.shift()
        m.titles.push(shifted)
        return shifted
      }

      let modalAlreadyExpanded = false

      function expandModal(type) {
        if (modalAlreadyExpanded) return
        modalAlreadyExpanded = true

        const dialogWrapperEl = document.querySelector(".p-loader__modal-wrapper")
        const dialogEl = document.querySelector(".p-loader__modal")

        window.addEventListener("resize", function () {
          document.querySelector(".p-loader__modal-wrapper").style.height = "auto"
        }, {
          passive: true
        })

        if (type === "slow") {
          dialogWrapperEl.style.marginTop = "32px"
        } else {
          document.querySelector(".p-loader__loading-indicators").style.opacity = "0"
        }
        document.querySelector(".p-loader--gradient").classList.add("p-loader--gradient-haserror")

        setTimeout(() => {
          const message = m.errors[type]

          if (type !== "slow") document.querySelector(".p-loader__loading-indicators").style.display = "none"
          document.querySelector(".p-loader__wrapper").style.cursor = "default"


          dialogEl.innerHTML = `<h1>${message.title}</h1><div class="p-loader__modal-content">${message.content}</div>`

          dialogWrapperEl.style.height = dialogEl.getBoundingClientRect().height + "px"
        }, 300)
      }

      titleEl.textContent = getTitle()

      timers.push(setInterval(function () {
        titleEl.classList.add("p-loader__title--disappear")
        setTimeout(function () {
          titleEl.textContent = getTitle()
          titleEl.classList.remove("p-loader__title--disappear")
        }, 500)
      }, 3500))

      let ctr = 0
      timers.push(setInterval(function () {
        ctr++
        // 6.5: the progress bar is *about* to be complete at 6.5s. 6.5s is the data
        // from Google Analytics so that a majority of our users would loaded the site already
        const mapped = 1 - Math.exp(-ctr/6.5)
        document.querySelector(".p-loader__loader-progress").style.width = mapped * 100 + "%"
      }, 250))

      const keyMap = {
        "subtitle": "p-loader__subtitle",
        "vendor": "p-loader__footer-vendor"
      }

      for (const [keyMessage, keyElement] of Object.entries(keyMap)) {
        document.getElementById(keyElement).innerHTML = m[keyMessage]
      }

      timers.push(setTimeout(() => {
        expandModal("slow")
      }, 15000))

      return [timers, expandModal]
    }
  };

  let timers = []
  let modalActivator = function () {}

  try {
    [timers, modalActivator] = _i18n.render()
  } catch (e) {
    console.error(e)
  }

  return [function () {
    for (const timer of timers) {
      clearInterval(timer)
    }
  }, modalActivator]
}

const [cancelLoaderAnimations, activateModal] = loader()








// eslint-disable-next-line no-unused-vars
function __reload() {
  cancelLoaderAnimations()

  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (const registration of registrations) {
      registration.unregister()
    }
  });
  caches.keys().then(keys => {
    caches.delete(keys.find(el => ~el.indexOf("workbox-precache")))
  });
  window.location.reload()
}

(function () {

  new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        const tagName = (node.tagName || '').toLowerCase();
        if ((tagName === 'script' && node.src.indexOf(window.location.origin)) || (tagName === 'link' && node.rel === 'stylesheet' && node.href)) {
          node.onerror = function (e) {
            console.error("Failed to get asset:", e);
            activateModal("coreLoad")
          }
        }
      }
    }
  })
    .observe(document.body, {
      childList: true,
      attributes: true,
      characterData: false,
    })

}());
