import fs from "fs/promises";

async function main() {
  const locales = await fs.readdir("./src/locales");

  const messages = await Promise.all(
    locales
      .filter((el) => el.endsWith(".js"))
      .map(async (locale) => ({
        locale: locale.replace(".js", ""),
        messages: await import(`../locales/${locale}`),
      }))
  );

  messages.forEach((locale) => {
    fs.writeFile(
      `./src/locales/${locale.locale}.json`,
      JSON.stringify(locale.messages.default)
    );
  });
}

main();
