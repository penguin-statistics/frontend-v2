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

  messages.forEach(({ locale, messages }) => {
    const newMessages = changeKey(messages, from, to);

    fs.writeFile(
      `./src/locales/${locale}.json`,
      JSON.stringify(newMessages, null, 2)
    );
  });
}

main();

// changeKey shall change the key name in all messages.
// `from` and `to` can all be in form of a key path, e.g. "foo.bar"
// for example:
// - content = { "foo": { "bar": "baz" } }, from = "foo.bar", to = "foo.baz": content = { "foo": { "baz": "baz" } }
// - content = { "foo": { "bar": "baz" } }, from = "foo.bar", to = "foo": content = { "foo": "baz" }
// - content = { "foo": { "bar": "baz", "baz": "qux" } }, from = "foo.bar", to = "foo.halo": content = { "foo": { "baz": "qux", "halo": "baz" } }
// - content = { "foo": "bar", "bar": { "k0": "v0", "k1": "v1" } }, from = "foo", to = "bar.k2": content = { "bar": { "k0": "v0", "k1": "v1", "k2": "bar" } }
// notice that: `from` and `to` may have 1 to many levels of nesting, and they may have different levels of nesting as well
// also, the `to` key path may or may not exist in the content. If it does not exist, it shall be created as needed, nested as deep as needed
// the solution should involve recursion
// the content is a plain object, not a Map
// the solution should be generic, not specific to the example above
function changeKey(content, from, to) {
  const fromKeys = from.split(".");
  const toKeys = to.split(".");

  if (fromKeys.length === 1) {
    const value = content[fromKeys[0]];
    delete content[fromKeys[0]];

    if (toKeys.length === 1) {
      content[toKeys[0]] = value;
    } else {
      let current = content;
      for (let i = 0; i < toKeys.length - 1; i++) {
        if (!current[toKeys[i]]) {
          current[toKeys[i]] = {};
        }
        current = current[toKeys[i]];
      }
      current[toKeys[toKeys.length - 1]] = value;
    }

    return content;
  }

  changeKey(content[fromKeys[0]], fromKeys.slice(1).join("."), to);
  return content;
}