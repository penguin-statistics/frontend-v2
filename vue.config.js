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
};
