import fs from "fs/promises";
import { parseComponent } from "vue-sfc-parser";


async function messagesFromLocalizationFiles() {
  const locales = await fs.readdir("./src/locales/archived");

  const messages = await Promise.all(
    locales
      .filter((el) => el.endsWith(".js"))
      .map(async (locale) => ({
        locale: locale.replace(".js", ""),
        messages: (await import(`../locales/archived/${locale}`)).default,
      }))
  );

  return messages.reduce((acc, el) => {
    acc[el.locale] = transformLocalizationFilesMessages(el.messages);
    return acc;
  }, {});
}

async function listAllSFCsUnderDir(path) {
  const dir = await fs.opendir(path);
  const files = [];
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      files.push(...(await listAllSFCsUnderDir(`${path}/${dirent.name}`)));
    } else {
      if (dirent.name.endsWith(".vue")) files.push(`${path}/${dirent.name}`);
    }
  }
  return files;
}

async function messagesFromSFCs() {
  // walk through all SFCs in src/components and src/views
  // and extract all messages from <i18n> blocks
  const components = await listAllSFCsUnderDir("./src/components");
  const views = await listAllSFCsUnderDir("./src/views");

  const i18nBlocks = (await Promise.all(
    components
      .concat(views)
      .filter((el) => el.endsWith(".vue"))
      .map(async (file) => {
        const content = await fs.readFile(file);
        const parsed = parseComponent(content.toString());
        const messages = parsed.customBlocks.find(
          (block) => block.type === "i18n"
        );
        if (!messages) return null;

        return {
          file,
          content: JSON.parse(messages.content),
        }
      })
  )).filter((el) => el !== null);

  console.log(
    `Found ${i18nBlocks.length} <i18n> blocks in ${components.length} components and ${views.length} views:\n\n`+
    i18nBlocks.map((el) => el.file).join("\n")
  );

  return i18nBlocks.map((el) => el.content);
}

function transformLocalizationFilesMessages(messages) {
  const transformedMessages = {};
  Object.keys(messages).forEach((key) => {
    const path = key.split(".");
    let current = transformedMessages;
    for (let i = 0; i < path.length; i++) {
      const pathPart = path[i];
      if (pathPart.endsWith("]")) {
        // array
        const arrayPath = pathPart.split("[");
        const arrayName = arrayPath[0];
        const arrayIndex = parseInt(arrayPath[1].replace("]", ""));
        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        if (i === path.length - 1) {
          // last part of the path
          current[arrayName][arrayIndex] = messages[key] || undefined;
        } else {
          if (!current[arrayName][arrayIndex]) {
            current[arrayName][arrayIndex] = {};
          }
          current = current[arrayName][arrayIndex];
        }
      } else {
        // object
        if (i === path.length - 1) {
          // last part
          current[pathPart] = messages[key] || undefined;
        } else {
          if (!current[pathPart]) {
            current[pathPart] = {};
          }
          current = current[pathPart];
        }
      }
    }
  });
  return transformedMessages;
}

// messages are in the format of Record<Locale, Message>[]
// where Message is a nested object.
// This function merges all messages into a single object, deeply,
// and prints a warning if a key is already defined. The warning
// shall include: the key path (e.g. "foo.bar[0].baz") and the locale.
// The output format should be Record<Locale, Message>, like { en: { foo: { bar: [ { baz: "baz" } ] } } }
// You can define a helper function to merge two objects.
function mergeMessages(...messages) {
  const merge = (obj1, obj2, path = []) => {
    Object.keys(obj2).forEach((key) => {
      if (obj1[key] && typeof obj1[key] === "object") {
        merge(obj1[key], obj2[key], [...path, key]);
      } else if (obj1[key]) {
        console.warn(
          `Key "${[...path, key].join(".")}" is already defined`
        );
        obj1[key] = obj2[key];
      } else {
        obj1[key] = obj2[key];
      }
    });
  }

  const mergedMessages = messages.reduce((acc, el) => {
    Object.keys(el).forEach((locale) => {
      if (!acc[locale]) {
        acc[locale] = {};
      }
      merge(acc[locale], el[locale]);
    });
    return acc;
  })

  return Object.keys(mergedMessages).map((locale) => ({
    locale,
    messages: mergedMessages[locale],
  }));
}


async function main() {
  const fromLocalizationFiles = await messagesFromLocalizationFiles();
  const fromSFCs = await messagesFromSFCs();
  const mergedMessages = mergeMessages(fromLocalizationFiles, ...fromSFCs);

  mergedMessages.forEach((locale) => {
    fs.writeFile(
      `./src/locales/${locale.locale}.json`,
      JSON.stringify(locale.messages, null, 2)
    );
  });
}

main();
