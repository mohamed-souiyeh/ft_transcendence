#!/bin/bash

source ~/.bashrc

# CERTS_DIR="${HOME}/.certs"

# mkdir -p ${CERTS_DIR}

# openssl genpkey -algorithm RSA -out ${CERTS_DIR}/private.key

# openssl req -new -key ${CERTS_DIR}/private.key -out ${CERTS_DIR}/csr.pem -subj "/C=MA/ST=somewhere/L=somewhere/O=trandandan, Inc./OU=IT/CN=trandandan.42.fr"

# openssl x509 -req -days 365 -in ${CERTS_DIR}/csr.pem -signkey ${CERTS_DIR}/private.key -out ${CERTS_DIR}/public.crt

cd /root/shared/transandance/back-end/

nvm install --lts node $NODE_VERSION

nvm install-latest-npm

npm install

/utils/scripts/wait_for_it.sh postgres:5432 -t 600

sleep 5

npm run push

npm run dev

# tail -F anything