import {Configuration, OpenAIApi} from "openai";
import {readFile, writeFile} from "fs/promises";
import fetch from "node-fetch";
import pLimit from "p-limit";

console.log("import.meta.env.OPENAI_API_KEY length:", import.meta.env.OPENAI_API_KEY.length);
console.log(
  "import.meta.env.SIMPLELOCALIZE_TOKEN length:",
  import.meta.env.SIMPLELOCALIZE_TOKEN.length
);

const configuration = new Configuration({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const languages = ["en_US"].map(el => ({
  originalId: el,
  seabornId: `${el}_x_seaborn`
}))

const getWordsCount = (str) => str.split(" ").filter(Boolean).length;

const stripFirstLastEmptyLine = (str) => str.replace(/^\n/, "").replace(/\n$/, "");

// flattenJsonKeys is a function that takes a JSON object and returns a flat object with the keys as a string
// e.g. { a: { b: { c: 1 } } } => { "a.b.c": 1 }
// e.g. { a: { b: { c: 1, d: 2 } } } => { "a.b.c": 1, "a.b.d": 2 }
const flattenJsonKeys = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "." : "";
    if (typeof obj[k] === "object") {
      Object.assign(acc, flattenJsonKeys(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

async function patchTranslations(path) {
  const patch = await readFile(path, "utf-8");
  const languageId = path.split("/").pop().split(".")[0];
  const parsedPatch = JSON.parse(patch);
  const translations = [];
  for (const [key, text] of Object.entries(parsedPatch)) {
    translations.push({
      key,
      text,
      language: languageId,
    });
  }
  await fetch("https://api.simplelocalize.io/api/v1/translations", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-SimpleLocalize-Token":
      import.meta.env.SIMPLELOCALIZE_TOKEN,
    },
    body: JSON.stringify({
      content: translations,
    }),
  });
}

async function invokeOpenAICompletion(languageOriginalId, message) {
  const chats = await readFile(
    `./src/scripts/seabornPrompts/${languageOriginalId}`,
    "utf-8"
  );

  const messages = chats
    .split("===")
    .filter(Boolean)
    .map((chatSegment) => {
      let [role, ...content] = chatSegment.split("---");
      role = stripFirstLastEmptyLine(role);
      content = stripFirstLastEmptyLine(content.join('\n---\n')).replace(
        "{{INPUT_MESSAGE}}",
        message
      );
      return {
        role,
        content,
      };
    });

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.8,
  }, {
    timeout: 20 * 1000
  });

  return completion.data.choices[0].message.content;
}

async function invokeOpenAICompletionWithRetries(languageOriginalId, message) {
  let retries = 0;
  while (retries < 5) {
    try {
      return await invokeOpenAICompletion(languageOriginalId, message);
    } catch (e) {
      console.log("retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }
  }
  return message;
}

const limit = pLimit(5);

async function main() {

  for (const language of languages) {
    const localeFile = await readFile(
      `./src/locales/${language.originalId}.json`,
      "utf-8"
    );
    const locale = JSON.parse(localeFile);
    const flattenedLocale = flattenJsonKeys(locale);

    const output = {};

    const promises = [];

    for (const [key, message] of Object.entries(flattenedLocale)) {
      promises.push(limit(async () => {
        const messageWordsCount = getWordsCount(message);

        let result;
        if (messageWordsCount <= 3) {
          result = message;
        // } else if (messageWordsCount >= 20) {
        //   return; // already translated
        } else {
          console.log(`=====\n${key} (${messageWordsCount} words; ${message.length})\n-> ${message}`);
          result = await invokeOpenAICompletionWithRetries(
            language.originalId,
            message
          );
          console.log(`<- ${result}`);
        }

        if (!result) {
          console.error("failed to translate", key, message);
          return;
        }

        output[key] = result;
      }))
    }

    console.log('waiting for promises...')

    await Promise.all(promises);

    await writeFile(
      `./src/locales/${language.seabornId}.json`,
      JSON.stringify(output, null, 2)
    );

    console.log('done!')

    await patchTranslations(`./src/locales/${language.seabornId}.json`);
  }
}

main();
// patchTranslations("./src/locales/archived/ja_JP_x_seaborn.json");
