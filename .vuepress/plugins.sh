#!/usr/bin/env bash
set -e

cd "$(dirname "$0")" || exit

PLUGINS=('storage-gcs' 'storage-minio' 'task-aws' 'task-crypto' 'task-fs' 'task-gcp' 'task-jdbc' 'task-kubernetes' 'task-notifications' 'task-serdes')

mkdir build
cd build || exit

for PLUGIN in "${PLUGINS[@]}"; do
    rm -rf build/docs/md

    echo -e "\e[42m Git :\e[0m ${PLUGIN}"
    git clone --depth=1 https://github.com/kestra-io/"${PLUGIN}" "${PLUGIN}"
    cd "${PLUGIN}" || exit

    echo -e "\e[42m Jar :\e[0m ${PLUGIN}"
    ./gradlew shadowJar --no-daemon

    echo -e "\e[42m Doc :\e[0m ${PLUGIN}"
    docker run --rm --name kestra-docs -i \
        -v "$(pwd)"/build/libs/:/app/plugins \
        -v "$(pwd)"/build/docs:/app/docs \
        kestra/kestra:develop \
        plugins doc \
        /app/docs/md

    if [[ -d docs ]]; then
         cp -r docs/* "build/docs/md/${PLUGIN}"
    fi

    cd ..
done

echo -e "\e[42m Doc :\e[0m Core"
docker run --rm --name kestra-docs -i \
    -v "$(pwd)"/cores/docs:/app/docs \
    kestra/kestra:develop \
    plugins doc \
    --core \
    /app/docs/md

for DOC in $(find . -type d -name md); do
    cp -r "${DOC}"/* ../../plugins
done
