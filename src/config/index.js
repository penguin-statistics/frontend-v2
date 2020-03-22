const client = {
  source: "frontend-v2",
  version: "v1.1.3"
};

export default {
  version: client.version,
  api: {
    submitParams: client
  },
  cdn: {
    global: "https://penguin.upyun.galvincdn.com"
  }
}