#!/bin/bash

source ~/.bashrc

cd /root/shared/transandance/back-end/

nvm install node

nvm install-latest-npm

npm install

npm run start