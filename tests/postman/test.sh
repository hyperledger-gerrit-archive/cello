#!/usr/bin/env bash

rm -rf ${ROOT_PATH}/tests/postman/newman
for testfile in ${ROOT_PATH}/tests/postman/test/*; do
    filename="${testfile##*/}"
    docker run -v ${ROOT_PATH}/tests/postman:/etc/newman --network="host" -v /tmp:/tmp postman/newman_ubuntu1404:4.4.0 run /etc/newman/test/$filename -e /etc/newman/env.json -r junit

    if [[ "$?" != "0" ]]; then
        echo "API tests ${filename} failed";
    else
        echo "API tests ${filename} passed";
    fi
done

rm -rf ${ROOT_PATH}/build/reports
mkdir -p ${ROOT_PATH}/build/reports && cp ${ROOT_PATH}/tests/postman/newman/*.xml ${ROOT_PATH}/build/reports/