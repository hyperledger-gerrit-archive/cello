
# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
FROM node
MAINTAINER li xu cheng "lixucheng@aliyun.com"
RUN npm install -g requirejs
RUN mkdir -p /usr/app/src
COPY . /usr/app/src
WORKDIR /usr/app/src
RUN cd /usr/app/src/js && npm install && npm run build && rm -rf node_modules && \
	cd /usr/app/src/js/home && npm install && npm run build && rm -rf node_modules && \
	cd /usr/app/src && npm install && npm run build && npm cache clean --force
EXPOSE 8080
CMD ["npm", "start"]