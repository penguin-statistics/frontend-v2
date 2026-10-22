module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ],
  overrides: [
    {
      // the RUM SDK (a lazy chunk) only needs the syntax webpack 4 cannot parse transpiled: older
      // browsers fail to load it, which the app tolerates. it stays ES modules so it is tree-shaken
      test: /[\\/]node_modules[\\/]@datadog[\\/]/,
      presets: [
        ['@vue/cli-plugin-babel/preset', {
          useBuiltIns: false,
          targets: { chrome: '79', edge: '79', firefox: '72', safari: '13', ios: '13' }
        }]
      ],
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', false]
      ]
    }
  ]
}
