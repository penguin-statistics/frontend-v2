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

  const changeKey = (content, from, to) => {
    const fromPath = from.split(".");
    const toPath = to.split(".");
    const fromKey = fromPath.pop();
    const toKey = toPath.pop();

    if (fromPath.length) {
      content[fromPath[0]] = changeKey(
        content[fromPath[0]],
        fromPath.slice(1).join("."),
        toPath.slice(1).join(".")
      );
    }

    if (toPath.length) {
      if (!content[toPath[0]]) {
        content[toPath[0]] = {};
      }

      // content[toPath[0]][toKey] = content[fromPath[0]][fromKey];
      // fromPath can be empty, so we need to check it
      content[toPath[0]][toKey] = fromPath.length
        ? content[fromPath[0]][fromKey]
        : content[fromKey];
    } else {
      content[toKey] = content[fromPath[0]][fromKey];
    }

    // delete content[fromPath[0]][fromKey];
    // TypeError: Cannot convert undefined or null to object
    // fromPath can be empty, so we need to check it
    if (fromPath.length) {
      delete content[fromPath[0]][fromKey];
    } else {
      delete content[fromKey];
    }

    return content;
  };

  // fix changeKey function: TypeError: Cannot read properties of undefined (reading 'bar')
  

  messages.forEach(({ locale, messages }) => {
    const newMessages = changeKey(messages, from, to);

    fs.writeFile(
      `./src/locales/${locale}.json`,
      JSON.stringify(newMessages, null, 2)
    );
  });
}

main();
