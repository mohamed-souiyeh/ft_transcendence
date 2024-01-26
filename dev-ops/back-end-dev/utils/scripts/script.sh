#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/back-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install

npm install ts-node

/utils/scripts/wait_for_it.sh postgres:5432 -t 600


npm run push

npm run generate

npm run seed &
npm run dev
