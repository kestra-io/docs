#!/usr/bin/env bash
set -e

cd "$(dirname "$0")" || exit

mkdir build
cd build || exit

echo -e "\e[42m Doc :\e[0m Core"
docker run --rm --name kestra-docs -i \
    -v "$(pwd)"/cores/docs:/app/docs \
    kestra/kestra:develop-full \
    plugins doc \
    --core \
    /app/docs/md

for DOC in $(find . -type d -name md); do
    cp -r "${DOC}"/* ../../plugins
done
