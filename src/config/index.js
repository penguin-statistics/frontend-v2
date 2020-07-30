const version = "v3.3.2";

module.exports = {
  version,
  api: {
    submitParams: {
      source: "frontend-v2",
      version
    }
  },
  authorization: {
    userId: {
      cookieKey: "userID"
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
    limit: 3,
    max: 104
  },
  servers: ["CN", "US", "JP", "KR"]
}