FROM node:16-bullseye

# Install basic development tools
RUN apt update && apt install -y less git procps

# Ensure default node user has access to /usr/local/share/yarn
RUN mkdir -p /usr/local/share/yarn && chown node:node /usr/local/share/yarn

# Set up non-root user
USER node

# Set the default shell to bash rather than sh
ENV SHELL /bin/bash