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

# terraform
git clone https://github.com/kestra-io/terraform-provider-kestra
cd terraform-provider-kestra/docs/

find  -type f -name "*.md" -exec sed -i 's/subcategory: ""/editLink: false/g' {} +
find . -type f -name "*.md" -exec sed -i 's/```terraform/```hcl/g' {} +

find data-sources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +
find resources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +
find guides -type f -name "*.md" -exec sed -Ei  's/page_title: "([^"]+)"/title: \1/g' {} +

find . -type f -name "*.md" -exec sed -Ei  's/-> (.*)/::alert{type="info"}\n\1\n::/g' {} +
find . -type f -name "*.md" -exec sed -Ei  's/~> (.*)/::alert{type="warning"}\n\1\n::/g' {} +
find . -type f -name "*.md" -exec sed -Ei  's/!> (.*)/::alert{type="danger"}\n\1\n::/g' {} +

sed -Ei  's/page_title: "([^ ]+).*"/title: Provider configurations/g' index.md
sed -Ei  's/^# kestra Provider/# Provider configurations/g' index.md
mv index.md guides/configurations.md

cp -R * ../../../content/docs/13.terraform/
rm -rf terraform-provider-kestra