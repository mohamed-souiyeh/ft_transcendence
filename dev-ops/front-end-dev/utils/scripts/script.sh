#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/front-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install -g

npm run dev