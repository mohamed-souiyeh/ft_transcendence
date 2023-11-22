#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/front-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install

npm run dev