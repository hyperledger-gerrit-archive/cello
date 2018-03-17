FROM alpine:3.7

RUN addgroup mongodb && \
    adduser -D -G mongodb -s /bin/bash -H mongodb

RUN apk upgrade --update && \
    apk add --no-cache mongodb=3.4.10-r0 && \
    rm /usr/bin/mongoperf

VOLUME /data/db

COPY docker-entrypoint.sh /
ENTRYPOINT [ "/docker-entrypoint.sh" ]

EXPOSE 27017
CMD ["mongod"]
