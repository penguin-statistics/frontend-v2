module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: "entry"
    }]
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs"
  ]
}
