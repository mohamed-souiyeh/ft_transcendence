FROM debian:latest

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

COPY ./pkgs /

COPY ./basic_utils /

RUN apt update -y && apt upgrade -y && apt install -y $(cat basic_utils)

RUN apt install -y $(cat pkgs)

# Installing Node
SHELL ["/bin/bash", "--login", "-c"]

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

RUN nvm install node

RUN npm install -g @nestjs/cli