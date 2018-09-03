# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

ifneq ($(shell uname),Darwin)
DOCKER_RUN_FLAGS=--user=$(shell id -u)
endif

ifeq ($(shell uname -m),s390x)
ifneq ($(shell id -u),0)
DOCKER_RUN_FLAGS+=-v /etc/passwd:/etc/passwd:ro
endif
endif

ifneq ($(http_proxy),)
DOCKER_BUILD_FLAGS+=--build-arg 'http_proxy=$(http_proxy)'
DOCKER_RUN_FLAGS+=-e 'http_proxy=$(http_proxy)'
endif
ifneq ($(https_proxy),)
DOCKER_BUILD_FLAGS+=--build-arg 'https_proxy=$(https_proxy)'
DOCKER_RUN_FLAGS+=-e 'https_proxy=$(https_proxy)'
endif
ifneq ($(HTTP_PROXY),)
DOCKER_BUILD_FLAGS+=--build-arg 'HTTP_PROXY=$(HTTP_PROXY)'
DOCKER_RUN_FLAGS+=-e 'HTTP_PROXY=$(HTTP_PROXY)'
endif
ifneq ($(HTTPS_PROXY),)
DOCKER_BUILD_FLAGS+=--build-arg 'HTTPS_PROXY=$(HTTPS_PROXY)'
DOCKER_RUN_FLAGS+=-e 'HTTPS_PROXY=$(HTTPS_PROXY)'
endif

