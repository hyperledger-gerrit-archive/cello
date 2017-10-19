
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
RUN npm install && npm cache clean --force && npm run build
EXPOSE 8080
CMD ["npm", "start"]