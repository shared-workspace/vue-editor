FROM mcr.microsoft.com/devcontainers/typescript-node:20-bookworm


RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && apt-get upgrade -y

COPY ./install-firefox.sh /tmp/
RUN chmod +x /tmp/install-firefox.sh && /tmp/install-firefox.sh
RUN rm -f /tmp/install-firefox.sh
RUN apt-get update -y && apt-get upgrade -y


