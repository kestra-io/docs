#!/usr/bin/env bash
set -e

cd "$(dirname "$0")" || exit

mkdir -p build
cd build || exit

# plugins
echo -e "\e[42m Doc :\e[0m Core"
docker run --rm --user=0 --name kestra-docs -i \
    -v "$(pwd)"/cores/docs:/app/docs \
    ghcr.io/kestra-io/kestra-ee:develop-full \
    plugins doc \
    --core \
    /app/docs/md

for DOC in $(find . -type d -name md); do
    cp -r "${DOC}"/* ../../plugins
done

# api

docker pull ghcr.io/kestra-io/kestra-ee:develop
docker create --rm --name kestra-ee --entrypoint=bash ghcr.io/kestra-io/kestra-ee:develop -c 'sleep 60'
docker cp kestra-ee:/app/kestra-ee /tmp/kestra-ee.zip
set +e
unzip -p /tmp/kestra-ee.zip META-INF/swagger/kestra-ee.yml > ../public/kestra-ee.yml
set -e

# terraform
cd ..
mkdir -p terraform
cd terraform || exit

git clone https://github.com/kestra-io/terraform-provider-kestra
cd terraform-provider-kestra/docs/

find  -type f -name "*.md" -exec sed -i 's/subcategory: ""/editLink: false/g' {} +
find . -type f -name "*.md" -exec sed -i 's/```terraform/```hcl/g' {} +

find data-sources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +
find resources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +
find guides -type f -name "*.md" -exec sed -Ei  's/page_title: "([^"]+)"/title: \1/g' {} +

find . -type f -name "*.md" -exec sed -Ei  's/-> (.*)/::: tip\n\1\n:::/g' {} +
find . -type f -name "*.md" -exec sed -Ei  's/~> (.*)/::: warning\n\1\n:::/g' {} +
find . -type f -name "*.md" -exec sed -Ei  's/!> (.*)/::: danger\n\1\n:::/g' {} +

sed -Ei  's/page_title: "([^ ]+).*"/title: Provider configurations/g' index.md
sed -Ei  's/^# kestra Provider/# Provider configurations/g' index.md
mv index.md guides/configurations.md

cp -R * ../../../../docs/terraform/
