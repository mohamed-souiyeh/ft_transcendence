#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/front-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install

/utils/scripts/wait_for_it.sh back-end-dev:1337 -t 600

npm run dev