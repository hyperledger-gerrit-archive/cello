
# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
FROM node:9.2
MAINTAINER haitao yue "hightall@me.com"
RUN npm install -g requirejs
COPY package.json /
RUN cd / && yarn install -g --verbose
RUN yarn add nodemon -g
ENV PATH ${PATH}:/node_modules/.bin
RUN mkdir -p /usr/app/src
#COPY . /usr/app/src
WORKDIR /usr/app/src
COPY ./fabric/bin/configtxgen /usr/local/bin/configtxgen
RUN chmod +x /usr/local/bin/configtxgen
COPY ./fabric/fabric /etc/hyperledger/fabric
#RUN mv /usr/app/src/js /reactjs && \
#	cd /reactjs && npm install && npm run build && rm -rf node_modules && \
#	cd /reactjs/home && npm install && npm run build && rm -rf node_modules && \
#	cd /usr/app/src && npm install && npm run build && npm cache clean --force
EXPOSE 8080
CMD ["npm", "start"]
