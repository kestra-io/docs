#!/usr/bin/env bash
set -e

cd "$(dirname "$0")" || exit

mkdir -p build
cd build || exit

# api
docker create --rm --name kestra-ee --entrypoint=bash ghcr.io/kestra-io/kestra-ee:develop -c 'sleep 60'
docker cp kestra-ee:/app/kestra-ee /tmp/kestra-ee.zip
docker rm kestra-ee
set +e
unzip -p /tmp/kestra-ee.zip META-INF/swagger/kestra-ee.yml > ../public/kestra-ee.yml
unzip -p /tmp/kestra-ee.zip META-INF/swagger/kestra.yml > ../public/kestra.yml
set -e
