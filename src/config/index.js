const version = process.env.npm_package_version;

const client = {
  source: "frontend-v2",
  version
};

module.exports = {
  version: version,
  api: {
    submitParams: client
  },
  cdn: {
    global: "https://penguin.upyun.galvincdn.com"
  }
}