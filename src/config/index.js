const version = "v3.6.6";
const project = "frontend-v2";

module.exports = {
  version,
  project,
  api: {
    submitParams: {
      source: project,
      version,
    },
  },
  authorization: {
    userId: {
      cookieKey: "userID",
    },
  },
  cdn: {
    cn: "https://penguin.upyun.galvincdn.com",
    global: "https://penguin-stats.s3.amazonaws.com",
  },
  advancedQuery: {
    maxQueries: 5,
  },
  randomBackground: {
    limit: 3,
    max: 446,
  },
  previewCard: {
    item: {
      pagination: 5,
    },
  },
  probe: {
    endpoint: {
      prod: {
        ws: "wss://probe.penguin-stats.io/",
        legacy: "https://probe.penguin-stats.io/",
      },
      dev: {
        ws: "ws://localhost:8100/",
        legacy: "http://localhost:8100/",
      },
    },
    uidExpiration: 1000 * 60 * 24 * 180,
  },
};
