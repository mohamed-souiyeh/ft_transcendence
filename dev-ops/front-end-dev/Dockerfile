FROM debian:latest

# RUN rm /bin/sh && ln -s /bin/bash /bin/sh

COPY ./utils /utils

RUN apt update -y && apt upgrade -y && apt install -y $(cat /utils/basic_utils | tr '\r\n' ' ')

# Installing Node

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash

CMD ["bash", "/utils/scripts/script.sh"]
