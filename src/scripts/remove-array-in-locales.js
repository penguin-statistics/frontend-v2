import fs from "fs/promises";

async function main() {
  const locales = await fs.readdir("./src/locales");
  const messages = await Promise.all(
    locales
      .filter((el) => el.endsWith(".json"))
      .map(async (locale) => ({
        locale: locale.replace(".json", ""),
        messages: (await import(`../locales/${locale}`)).default,
      }))
  );

  // now, recursively find any array in the messages. If there is an array, it
  // will only be a string[]. Join all the strings together with a \n,
  // and replace the array with the joined string instead.
  // for the recursive part, we can use a function that takes an object and
  // returns a new object with the same keys, but with the values being
  // the result of the recursive call on the value.
  // also, for any array replaced, log the locale and the key path (not the key itself, but rather something like "foo.bar[0].baz") to the console.

  for (const locale of messages) {
    const recursive = (obj, path = []) => {
      if (Array.isArray(obj)) {
        console.log("Found array in locale [", locale.locale, "] at path [", path.join("."), "]");
        return obj.join("\n");
      } else if (typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, recursive(value, [...path, key])])
        );
      } else {
        return obj;
      }
    }
    locale.messages = recursive(locale.messages);

    await fs.writeFile(
      `./src/locales/temp/${locale.locale}.json`,
      JSON.stringify(locale.messages, null, 2)
    );
  }

}

main();
