FROM node:16 AS builder
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
RUN yarn install

COPY . .

RUN yarn build:web

# runner
FROM nginx:stable AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

# let nginx return index.html for any request
COPY build/nginx-default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
