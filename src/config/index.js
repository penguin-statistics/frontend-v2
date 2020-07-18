const version = "v3.2.3";

module.exports = {
  version,
  api: {
    submitParams: {
      source: "frontend-v2",
      version
    }
  },
  cdn: {
    cn: "https://penguin.upyun.galvincdn.com",
    global: "https://penguin-stats.s3.amazonaws.com"
  },
  advancedQuery: {
    maxQueries: 5,
  },
  randomBackground: {
    limit: 5,
    max: 104
  },
  servers: ["CN", "US", "JP", "KR"]
}