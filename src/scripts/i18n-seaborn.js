import {Configuration, OpenAIApi} from "openai";
import {readFile, writeFile} from "fs/promises";
import fetch from "node-fetch";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const languages = ["zh_CN"].map(el => ({
  originalId: el,
  seabornId: `${el}_x_seaborn`
}))

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
      process.env.SIMPLELOCALIZE_TOKEN,
    },
    body: JSON.stringify({
      content: translations,
    }),
  });
}

async function main() {

  for (const language of languages) {
    const chats = await readFile(
      `./src/scripts/seaborn/${language.originalId}`,
      "utf-8"
    );

    async function invokeOpenAICompletion(message) {
      const messages = chats
        .split("===")
        .filter(Boolean)
        .map((chatSegment) => {
          let [role, content] = chatSegment.split("---");
          role = stripFirstLastEmptyLine(role);
          content = stripFirstLastEmptyLine(content).replace(
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
      });

      return completion.data.choices[0].message.content;
    }

    const localeFile = await readFile(
      `./src/locales/${language.originalId}.json`,
      "utf-8"
    );
    const locale = JSON.parse(localeFile);
    const flattenedLocale = flattenJsonKeys(locale);

    const output = {};

    for (const [key, message] of Object.entries(flattenedLocale)) {
      let result;
      if (message.length < 4) {
        result = message;
      } else if (message.length >= 10) {
        continue // already translated
      } else {
        result = await invokeOpenAICompletion(message);
        console.log(`=====\n${key} (${message.length})\n-> ${message}\n<- ${result}\n`);
      }

      output[key] = result;
    }

    await writeFile(
      `./src/locales/${language.seabornId}.json`,
      JSON.stringify(output, null, 2)
    );

    patchTranslations(`./src/locales/${language.seabornId}.json`);


  }
}

main();
// patchTranslations("./src/locales/zh_CN_x_seaborn.json");
