FROM node:16.20.2 AS builder
WORKDIR /app

ARG TRUNCATED_GITHUB_SHA
ENV TRUNCATED_GITHUB_SHA $TRUNCATED_GITHUB_SHA

ENV PENGUIN_BUILDFROM=docker

# Optional HTTPS static CDN prefix; this does not change the API base URL.
ARG PENGUIN_STATIC_PUBLIC_PATH
ENV PENGUIN_STATIC_PUBLIC_PATH=$PENGUIN_STATIC_PUBLIC_PATH

COPY package.json .
COPY yarn.lock .

# Setup yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate \
    && yarn install --frozen-lockfile

COPY . .

# Optional Datadog RUM configuration; RUM is not loaded when the application ID or client token is empty.
ARG VUE_APP_DATADOG_RUM_APPLICATION_ID
ARG VUE_APP_DATADOG_RUM_CLIENT_TOKEN
ARG VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE
ENV VUE_APP_DATADOG_RUM_APPLICATION_ID=$VUE_APP_DATADOG_RUM_APPLICATION_ID \
    VUE_APP_DATADOG_RUM_CLIENT_TOKEN=$VUE_APP_DATADOG_RUM_CLIENT_TOKEN \
    VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE=$VUE_APP_DATADOG_RUM_SESSION_SAMPLE_RATE

RUN yarn build:web

# runner: Caddy (the version of the box's edge), pinned by digest. It serves the build on :80, without TLS, HTTP/2
# or HTTP/3: the box's edge Caddy terminates TLS in front of it. Runs as an unprivileged user; the binary has
# cap_net_bind_service for :80.
FROM caddy:2.11.7-alpine@sha256:e70b164da81ef698b3ad19af799ea6086ce6d9e48ed4079eb9fe26f6fbf14ee5 AS runner

COPY --from=builder /app/dist /srv
COPY build/Caddyfile /etc/caddy/Caddyfile
RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

USER 65534:65534
EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
