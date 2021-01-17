// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/loader.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var loader = function loader() {
  // gradient timeout
  setTimeout(function () {
    document.getElementById("p-loader--gradientel").style.opacity = 1;
  }, 750);
  var _i18n = {
    languageWithRegion: function languageWithRegion() {
      var nav = window.navigator,
          browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
          i,
          language,
          len,
          shortLanguage = null; // support for HTML 5.1 "navigator.languages"

      if (Array.isArray(nav.languages)) {
        for (i = 0; i < nav.languages.length; i++) {
          language = nav.languages[i];
          len = language.length;

          if (!shortLanguage && len) {
            shortLanguage = language;
          }

          if (language && len > 2) {
            return language;
          }
        }
      } // support for other well known properties in browsers


      for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = nav[browserLanguagePropertyKeys[i]]; //skip this loop iteration if property is null/undefined.  IE11 fix.

        if (language == null) {
          continue;
        }

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
    language: function language() {
      if (localStorage) {
        var settings = localStorage.getItem("penguin-stats-settings");

        if (settings) {
          try {
            var data = JSON.parse(settings);
            return data.settings.language;
          } catch (e) {
            // fallback
            return "en";
          }
        }
      }

      var language = this.languageWithRegion().replace("_", "-");
      if (!language) return "en"; // use default

      var languages = language.split("-");

      if (languages.length === 1) {
        return language;
      } else if (languages.length === 2) {
        return languages[0];
      } else {
        // probably malformed...
        return "en";
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
            content: "<ul><li>\u8BF7\u5C1D\u8BD5 <button onclick='__reload()'>\u91CD\u8F7D\u9875\u9762</button></li>\n<li>\u82E5\u5C61\u6B21\u51FA\u73B0\u6B64\u9519\u8BEF\uFF0C\u8BF7<a href=\"/update-browser.html\" target=\"_blank\">\u5347\u7EA7\u60A8\u7684\u6D4F\u89C8\u5668</a></li></ul>"
          },
          coreExec: {
            title: "核心资源解析失败",
            content: "<p>\u7531\u4E8E\u60A8\u7684\u6D4F\u89C8\u5668\u8FC7\u4E8E\u8FC7\u65F6\uFF0C\u9875\u9762\u5728\u6E32\u67D3\u65F6\u53D1\u751F\u4E86\u9519\u8BEF\u3002</p><p>\u8BF7 <a href=\"/update-browser.html\" target=\"_blank\">\u5347\u7EA7\u60A8\u7684\u6D4F\u89C8\u5668</a></p>"
          },
          slow: {
            title: "加载过于缓慢",
            content: "<p>\u68C0\u6D4B\u5230\u9875\u9762\u8D44\u6E90\u52A0\u8F7D\u8FC7\u4E8E\u7F13\u6162\uFF08\u52A0\u8F7D\u65F6\u957F\u8D85\u8FC7 15s\uFF09</p><ul><li>\u8BF7\u5C1D\u8BD5 <button onclick='__reload()'>\u4F7F\u7528 CN \u955C\u50CF</button></li>\n<li>\u82E5\u6301\u7EED\u672A\u54CD\u5E94\uFF0C\u8BF7<a href=\"/update-browser.html\" target=\"_blank\">\u5347\u7EA7\u60A8\u7684\u6D4F\u89C8\u5668</a></li></ul>"
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
            content: "<ul><li>Please try <button onclick='__reload()'>Reload the Page</button></li>\n<li>If this error occurs multiple times, please <a href=\"/update-browser.html\" target=\"_blank\">Upgrade your Browser</a></li></ul>"
          },
          slow: {
            title: "Resources took too long to load",
            content: "<p>An unreasonably length of time has elapsed to load resources on this page (took over 15 seconds)</p><ul><li>Please try <button onclick='__reload()'>Use the CN Mirror</button></li>\n<li>If this error occurs multiple times, please <a href=\"/update-browser.html\" target=\"_blank\">Upgrade your Browser</a></li></ul>"
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
      }
    },
    fill: function fill(key, content) {
      document.getElementById(key).innerHTML = content;
    },
    render: function render() {
      document.querySelector("#p-loader__footer--year").textContent = new Date().getFullYear().toString();
      var language = this.language();
      var m = this.data[language];
      var titleEl = document.querySelector(".p-loader__title");
      var timers = [];

      function getTitle() {
        var shifted = m.titles.shift();
        m.titles.push(shifted);
        return shifted;
      }

      var modalAlreadyExpanded = false;

      function expandModal(type) {
        if (modalAlreadyExpanded) return;
        modalAlreadyExpanded = true;
        var dialogWrapperEl = document.querySelector(".p-loader__modal-wrapper");
        var dialogEl = document.querySelector(".p-loader__modal");
        window.addEventListener("resize", function () {
          document.querySelector(".p-loader__modal-wrapper").style.height = "auto";
        }, {
          passive: true
        });

        if (type === "slow") {
          dialogWrapperEl.style.marginTop = "32px";
        } else {
          document.querySelector(".p-loader__loading-indicators").style.opacity = "0";
        }

        document.querySelector(".p-loader--gradient").classList.add("p-loader--gradient-haserror");
        setTimeout(function () {
          var message = m.errors[type];
          if (type !== "slow") document.querySelector(".p-loader__loading-indicators").style.display = "none";
          document.querySelector(".p-loader__wrapper").style.cursor = "default";
          dialogEl.innerHTML = "<h1>".concat(message.title, "</h1><div class=\"p-loader__modal-content\">").concat(message.content, "</div>");
          dialogWrapperEl.style.height = dialogEl.getBoundingClientRect().height + "px";
        }, 300);
      }

      titleEl.textContent = getTitle();
      timers.push(setInterval(function () {
        titleEl.classList.add("p-loader__title--disappear");
        setTimeout(function () {
          titleEl.textContent = getTitle();
          titleEl.classList.remove("p-loader__title--disappear");
        }, 500);
      }, 3500));
      var ctr = 0;
      timers.push(setInterval(function () {
        ctr++; // 6.5: the progress bar is *about* to be complete at 6.5s. 6.5s is the data
        // from Google Analytics so that a majority of our users would loaded the site already

        var mapped = 1 - Math.exp(-ctr / 6.5);
        document.querySelector(".p-loader__loader-progress").style.width = mapped * 100 + "%";
      }, 250));
      var keyMap = {
        "subtitle": "p-loader__subtitle",
        "vendor": "p-loader__footer-vendor"
      };

      for (var _i = 0, _Object$entries = Object.entries(keyMap); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            keyMessage = _Object$entries$_i[0],
            keyElement = _Object$entries$_i[1];

        document.getElementById(keyElement).innerHTML = m[keyMessage];
      }

      timers.push(setTimeout(function () {
        expandModal("slow");
      }, 15000));
      return [timers, expandModal];
    }
  };
  var timers = [];

  var modalActivator = function modalActivator() {};

  try {
    var _i18n$render = _i18n.render();

    var _i18n$render2 = _slicedToArray(_i18n$render, 2);

    timers = _i18n$render2[0];
    modalActivator = _i18n$render2[1];
  } catch (e) {
    console.error(e);
  }

  return [function () {
    var _iterator = _createForOfIteratorHelper(timers),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var timer = _step.value;
        clearInterval(timer);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }, modalActivator];
};

var _loader = loader(),
    _loader2 = _slicedToArray(_loader, 2),
    cancelLoaderAnimations = _loader2[0],
    activateModal = _loader2[1]; // eslint-disable-next-line no-unused-vars


function __reload() {
  cancelLoaderAnimations();
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    var _iterator2 = _createForOfIteratorHelper(registrations),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var registration = _step2.value;
        registration.unregister();
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
  caches.keys().then(function (keys) {
    caches["delete"](keys.find(function (el) {
      return ~el.indexOf("workbox-precache");
    }));
  });
  window.location.reload();
}

(function () {
  new MutationObserver(function (mutations) {
    var _iterator3 = _createForOfIteratorHelper(mutations),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var mutation = _step3.value;

        var _iterator4 = _createForOfIteratorHelper(mutation.addedNodes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var node = _step4.value;
            var tagName = (node.tagName || '').toLowerCase();

            if (tagName === 'script' && node.src.indexOf(window.location.origin) || tagName === 'link' && node.rel === 'stylesheet' && node.href) {
              node.onerror = function (e) {
                console.error("Failed to get asset:", e);
                activateModal("coreLoad");
              };
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }).observe(document.body, {
    childList: true,
    attributes: true,
    characterData: false
  });
})();
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49282" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/loader.js"], null)
//# sourceMappingURL=/loader.b334b160.js.map