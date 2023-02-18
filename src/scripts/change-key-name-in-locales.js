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

  if (process.argv.length < 4) {
    console.log(
      "Usage: npx esno src/scripts/change-key-name-in-locales.js <from> <to>"
    );
    return;
  }

  const from = process.argv[2];
  const to = process.argv[3];

  // change the key name in all locales
  // `from` and `to` can all be in form of a key path, e.g. "foo.bar"
  // for example:
  // - content = { "foo": { "bar": "baz" } }, from = "foo.bar", to = "foo.baz": content = { "foo": { "baz": "baz" } }
  // - content = { "foo": { "bar": "baz" } }, from = "foo.bar", to = "foo": content = { "foo": "baz" }
  // - content = { "foo": { "bar": "baz", "baz": "qux" } }, from = "foo.bar", to = "foo.halo": content = { "foo": { "baz": "qux", "halo": "baz" } }
  // - content = { "foo": "bar", "bar": { "k0": "v0", "k1": "v1" } }, from = "foo", to = "bar.k2": content = { "bar": { "k0": "v0", "k1": "v1", "k2": "bar" } }
  // notice that, from and to may have 1 to many levels of nesting, and they may have different levels of nesting as well

  function changeKey(content, from, to) {
    if (typeof content !== "object") {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((el) => changeKey(el, from, to));
    }

    const fromParts = from.split(".");
    const toParts = to.split(".");

    const fromKey = fromParts[0];
    const toKey = toParts[0];

    if (fromParts.length === 1 && toParts.length === 1) {
      if (fromKey in content) {
        const fromValue = content[fromKey];
        delete content[fromKey];

        content[toKey] = fromValue;
      }

      return content;
    }

    if (fromKey in content) {
      const fromValue = content[fromKey];

      if (fromParts.length > 1) {
        content[fromKey] = changeKey(
          fromValue,
          fromParts.slice(1).join("."),
          to
        );
      } else {
        content[fromKey] = changeKey(
          fromValue,
          from,
          toParts.slice(1).join(".")
        );
      }
    }

    if (toKey in content) {
      const toValue = content[toKey];

      if (toParts.length > 1) {
        content[toKey] = changeKey(toValue, from, toParts.slice(1).join("."));
      } else {
        content[toKey] = changeKey(toValue, fromParts.slice(1).join("."), to);
      }
    }

    return content;
  }
  

  messages.forEach(({ locale, messages }) => {
    const newMessages = changeKey(messages, from, to);

    fs.writeFile(
      `./src/locales/${locale}.json`,
      JSON.stringify(newMessages, null, 2)
    );
  });
}

main();
