module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: 'entry'
    }]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ]
}
