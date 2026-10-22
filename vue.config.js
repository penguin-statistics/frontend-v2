const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

require("events").EventEmitter.defaultMaxListeners = 50;

const packageVersion = `v${envvar("npm_package_version", "0.0.0", true)}`;

let commitHash;

try {
  commitHash = process.env.TRUNCATED_GITHUB_SHA ||
    require("child_process")
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim() || "unknown";
} catch (e) {
  commitHash = "unknown";
}

function envvar(name, fallback, skipStringify = false) {
  let content = process.env[name];
  if (content) content = content.trim();
  if (skipStringify) return content || fallback;
  return JSON.stringify(content || fallback) || '"null"';
}

const templateRoot = path.resolve(
  __dirname,
  `./src/templates/${envvar("PENGUIN_PLATFORM", "web", true)}`
);
const templateFile = path.resolve(templateRoot, "./index.html");

// 📝📑🛒📋📃
console.log(`
🐧 Current build configured as:
  - 📱 Platform (from env:'PENGUIN_PLATFORM'): ${envvar(
  "PENGUIN_PLATFORM",
  "web",
  true
)}
  - 📊 Build Hash (from env:'TRUNCATED_GITHUB_SHA' || cmd:'git rev-parse --short HEAD'): ${commitHash}
  - 📋 Build Version (from env:'npm_package_version'): ${packageVersion}
  - 📋 Template Root: ${templateRoot}
  - 📃 Using Template File: ${templateFile}

  > 📝 Initiating vue-cli-service...`);

module.exports = {
  publicPath: require("./build/public-path")(),
  pluginOptions: {
    i18n: {
      locale: "zh",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  // productionSourceMap: false,
  devServer: {
    proxy: {
      "/PenguinStats": {
        target: "https://penguin-stats.io/",
        // target: "http://localhost:9010/",
        // target: "http://10.0.0.164:9010/",
      },
    },
  },
  // integrity: false,
  runtimeCompiler: true,
  // @datadog: the RUM SDK uses syntax (optional chaining...) that webpack 4 cannot parse
  transpileDependencies: ["vuetify", "fuse.js", "semver", "protobufjs", "@datadog"],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        GIT_COMMIT: JSON.stringify(commitHash),
        PENGUIN_PLATFORM: envvar("PENGUIN_PLATFORM", "unspecified"),
        PENGUIN_BUILDFROM: envvar("PENGUIN_BUILDFROM", null),
        NPM_PACKAGE_VERSION: JSON.stringify(packageVersion), // stringify
      }),
      new CopyPlugin({
        patterns: [
          {
            from: templateRoot,
            noErrorOnMissing: true,
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),

    ],
    module: {
      rules: [
        {
          test: /\.ya?ml$/,
          use: "js-yaml-loader",
        },
        {
          test: /\.md$/,
          use: "raw-loader",
        },
      ],
    },
  },
  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].template = templateFile;
      args[0].minify = {
        ...args[0].minify,
        minifyCSS: true,
        minifyJS: true,
      }
      return args;
    });

    // we dont need prefetch plugin
    config.plugins.delete("prefetch");

    // webpack 4 resolves the imports of .mjs files with the "main" field only, which would bundle
    // the CommonJS builds of the RUM SDK packages: use their ES modules, which can be tree-shaken
    config.module
      .rule("datadog-mjs")
      .test(/\.mjs$/)
      .include.add(/[\\/]node_modules[\\/]@datadog[\\/]/)
      .end()
      .resolve.mainFields.merge(["browser", "module", "main"]);
  },
};
