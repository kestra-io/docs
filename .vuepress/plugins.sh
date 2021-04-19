#!/usr/bin/env bash
set -e

cd "$(dirname "$0")" || exit

mkdir -p build
cd build || exit

# plugins
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

# terraform
cd ..
mkdir -p terraform
cd terraform || exit

git clone https://github.com/kestra-io/terraform-provider-kestra
cd terraform-provider-kestra/docs/
rm index.md

find  -type f -name "*.md" -exec sed -i 's/subcategory: ""/editLink: false/g' {} +

find data-sources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +
find resources -type f -name "*.md" -exec sed -Ei  's/page_title: "([^ ]+).*"/title: \1/g' {} +

find guides -type f -name "*.md" -exec sed -Ei  's/page_title: "([^"]+)"/title: \1/g' {} +

find . -type f -name "*.md" -exec sed -i 's/```terraform/```hcl/g' {} +
cp -R * ../../../../docs/terraform/
