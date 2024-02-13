#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/back-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

/utils/scripts/wait_for_it.sh back-end-dev:1337 -t 600

sleep 5

npm run studio

# tail -F anything