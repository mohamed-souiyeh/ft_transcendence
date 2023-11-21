#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/back-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install --include=dev

npm run dev

# tail -F anything