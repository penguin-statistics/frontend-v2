const webpack = require("webpack");

require('events').EventEmitter.defaultMaxListeners = 50;

let commitHash;

try {
  commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString() || "unknown";
} catch (e) {
  commitHash = "unknown"
}

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/PenguinStats": {
        target: "https://penguin-stats.io"
      }
    }
  },
  integrity: false,
  runtimeCompiler: true,
  transpileDependencies: [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        GIT_COMMIT: JSON.stringify(commitHash).trim()
      }),
      // new InjectManifest ({
      //   swSrc: "./src/workers/service-worker.js",
      //   dontCacheBustURLsMatching: /.[a-f0-9]{8}./
      // })
    ],
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-svg-inline-loader")
      .loader("vue-svg-inline-loader");
  }
};
