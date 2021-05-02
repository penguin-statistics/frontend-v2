const webpack = require('webpack')
const config = require('./src/config/index.js')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

require('events').EventEmitter.defaultMaxListeners = 50

let commitHash

try {
  commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim() || 'unknown'
} catch (e) {
  commitHash = 'unknown'
}

function envvar (name, fallback, skipStringify = false) {
  let content = process.env[name]
  if (content) content = content.trim()
  if (skipStringify) return content || fallback
  return JSON.stringify(content || fallback) || '"null"'
}

const noscriptImage = JSON.stringify(`${config.probe.endpoint.prod.legacy}?v=${config.version}&p=web&l=1`)

const templateRoot = path.resolve(__dirname, `./src/templates/${envvar('PENGUIN_PLATFORM', 'web', true)}`)
const templateFile = path.resolve(templateRoot, './index.html')

// 📝📑🛒📋📃
console.log(`
🐧 Current build configured as:
  - 📱 Platform (from env:'PENGUIN_PLATFORM'): ${envvar('PENGUIN_PLATFORM', 'web', true)}
  - 📊 Build Hash (from cmd:'git rev-parse --short HEAD'): ${commitHash}
  - 📋 Template Root: ${templateRoot}
  - 📃 Using Template File: ${templateFile}
  @ 🛒 Probe
    - 📑 <noscript> fallback GET endpoint: ${noscriptImage}

  > 📝 Initiating vue-cli-service...`)

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/PenguinStats': {
        target: 'http://localhost:8081'
      }
    }
  },
  integrity: false,
  runtimeCompiler: true,
  transpileDependencies: [
    'vuetify',
    'fuse.js',
    'semver',
    'protobufjs'
  ],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        GIT_COMMIT: JSON.stringify(commitHash),
        PENGUIN_PLATFORM: envvar('PENGUIN_PLATFORM', 'unspecified'),
        PENGUIN_PLATFORM_FROM: envvar('PENGUIN_PLATFORM_FROM', null),
        PENGUIN_PROBE_NOSCRIPT: noscriptImage
      }),
      new CopyPlugin({
        patterns: [
          {
            from: templateRoot,
            globOptions: {
              ignore: ['/index.html']
            }
          }
        ]
      })
      // new InjectManifest ({
      //   swSrc: "./src/workers/service-worker.js",
      //   dontCacheBustURLsMatching: /.[a-f0-9]{8}./
      // })
    ],
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: 'js-yaml-loader'
        },
        {
          test: /\.md$/,
          use: 'raw-loader'
        }
      ]
    }
  },
  chainWebpack (config) {
    config
      .plugin('html')
      .tap(args => {
        args[0].template = templateFile
        return args
      })
  }
}
