// Static asset URL only. API requests and SPA routes remain on the site origin.
module.exports = function publicPath(env = process.env) {
  const value = (env.PENGUIN_STATIC_PUBLIC_PATH || "").trim();
  if (!value || env.NODE_ENV !== "production" || env.PENGUIN_PLATFORM !== "web") return "/";
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("PENGUIN_STATIC_PUBLIC_PATH must be an HTTPS CDN URL without credentials, query, or fragment");
  }
  return url.href.replace(/\/?$/, "/");
};
