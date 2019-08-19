module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  devServer: {
    proxy: 'http://localhost:8081/PenguinStats/api'
  },
  integrity: true,
  runtimeCompiler: true,
  pwa: {
    name: "企鹅物流数据统计",
    themeColor: "#2d66ba",
    msTileColor: "#1d499b",
    appleMobileWebAppStatusBarStyle: "black-translucent",

    workboxPluginMode: "GenerateSW",
    iconPaths: {
      favicon32: 'assets/favicon/favicon-32x32.png',
      favicon16: 'assets/favicon/favicon-16x16.png',
      appleTouchIcon: 'assets/favicon/apple-touch-icon.png',
      maskIcon: 'assets/favicon/safari-pinned-tab.svg',
      msTileImage: 'assets/favicon/mstile-150x150.png'
    }
  }
};
