const client = {
  source: "frontend-v2",
  version: "v1.1.8"
};

module.exports = {
  version: client.version,
  api: {
    submitParams: client
  },
  cdn: {
    cn: "https://penguin.upyun.galvincdn.com",
    global: "https://penguin-stats.s3.amazonaws.com"
  }
}