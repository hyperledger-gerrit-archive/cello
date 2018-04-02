# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
FROM hyperledger/cello-baseimage:x86_64-latest

RUN apt-get update \
    && apt-get -y install curl \
    && cd /usr/local \
    && curl https://nexus.hyperledger.org/content/repositories/releases/org/hyperledger/fabric/hyperledger-fabric/linux-amd64-1.0.6/hyperledger-fabric-linux-amd64-1.0.6.tar.gz | tar xz

# use this in development
CMD ["python", "dashboard.py"]


# use this in product
#CMD ["gunicorn", "-w", "128", "-b", "0.0.0.0:8080", "dashboard:app"]
