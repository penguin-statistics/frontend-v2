FROM node:lts AS builder
WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Setup yarn
RUN yarn install

COPY . .

# Build the app
RUN yarn build:web

# runner
FROM nginx:stable AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx" "-g" "daemon off;"]
