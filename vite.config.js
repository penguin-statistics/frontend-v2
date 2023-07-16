import {defineConfig, loadEnv} from "vite"
import vue from "@vitejs/plugin-vue2"
import legacy from "@vitejs/plugin-legacy"
import {manualChunksPlugin} from "vite-plugin-webpackchunkname"
import path from "path";
import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig((({mode}) => {
  const env = loadEnv(mode, process.cwd());

  const packageVersion = `v${packageJson.version}`;

  let commitHash;

  try {
    commitHash = env["TRUNCATED_GITHUB_SHA"]
  } catch (e) {
    commitHash = "unknown";
  }

  function envvar(name, fallback, skipStringify = false) {
    console.debug(`envvar(${name}, ${fallback}, ${skipStringify})`);
    console.debug(env)
    let content = env[name];
    if (content) content = content.trim();
    if (skipStringify) return content || fallback;
    return JSON.stringify(content || fallback) || '"null"';
  }

  const noscriptImage = JSON.stringify(
    `https://probe.penguin-stats.io/?v=${packageVersion}&p=web&l=1`
  );

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
  @ 🛒 Probe
    - 📑 <noscript> fallback GET endpoint: ${noscriptImage}

  > 📝 Initiating vite...`);

  return {
    resolve: {
      alias: {
        '@': __dirname + '/src',
        vue: '@vue/compat'
      },
      extensions: [
        '.js',
        '.vue',
      ]
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      }),
      // legacy(),
      manualChunksPlugin()
    ],
    define: {
      GIT_COMMIT: JSON.stringify(commitHash),
      PENGUIN_PLATFORM: envvar("PENGUIN_PLATFORM", "unspecified"),
      PENGUIN_BUILDFROM: envvar("PENGUIN_BUILDFROM", null),
      PENGUIN_PROBE_NOSCRIPT: noscriptImage,
      NPM_PACKAGE_VERSION: JSON.stringify(packageVersion), // stringify
    },
  }
}))
