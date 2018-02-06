# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
FROM ubuntu:xenial
COPY install.sh /tmp/
RUN cd /tmp/ && \
    bash install.sh && \
rm -f /tmp/install.sh
