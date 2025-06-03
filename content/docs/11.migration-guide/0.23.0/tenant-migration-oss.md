---
title: Open-Source Migration Guide to introduce defaultTenant
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS"]
---

## Overview

Kestra now requires a tenant context in the OSS version.

## Open-Source Edition Changes

### Default Tenant

A fixed, non-configurable tenant named "main" is always used now in the open-source version. The tenant is not stored in the database and does not impact the user experience in the UI or building flows.

### Breaking change

All Open-source API URIs now include the tenantId:

**Before**: `/api/v1/...`

**0.23 & onwards**: `/api/v1/main/...`

Temporarily, there is a compatibility layer implemented to map `/api/v1/...` to `/api/v1/main/...` to ease the transition, but this compatibility layer will eventually be removed in a future Kestra version.

### Migration Script

To add the tenantId field across your existing database (flows, executions, logs, etc.), use:

```shell
kestra migrate default-tenant --dry-run
```

::alert{type="info"}
- Use `--dry-run` to preview changes without modifying data.
- Re-run without the flag to execute the migration.
::

### Kafka Queue Handling

If your queue is Kafka, queues will be recreated after migration. You don’t need to do anything manually — we recreate the queue automatically for you.

## Internal Storage Migration Guide from `defaultTenant` to a tenant

This section explains how to migrate internal storage data to ensure the tenant ID is included and properly queried by the application. Migration can be done via the provided scripts or directly through the management console of your cloud storage provider.

### **Who needs to perform this migration?**
- All OSS users need to run the migration script to ensure that the tenant ID is included in the internal storage paths.

## Local Storage

The following script ensures that the `main` tenand ID is added to the internal storage path for your configuration. For OSS, this ID is immutable, so there is no need to adjust the name or path.

```bash
for f in base-path/*; do
    bn=$(basename "$f")
    [[ "$bn" == "main" ]] || {
        rsync -a "$f/" base-path/main/"$bn"/ && rm -rf "$f"
    };
done
```

- Your `base-path` is configured under the configuration section `kestra.storage.local.base-path`.
- For OSS users, the destination tenant ID is always `main`, thus you should keep the `base-path/main/` intact.

---

## MinIO Storage

For MinIO, we recommend keeping the `undefined` option due to the different handling of storage paths.

### OSS Users

```bash
for f in $(mc ls myminio/mybucket | awk '{print $NF}' | sed 's|/$||'); do
    if [[ "$f" != "main" && "$f" != "tenant" && "$f" != "undefined" ]]; then
        echo "Moving $f → main/"
        mc mv --recursive "myminio/mybucket/$f" "myminio/mybucket/main/"
    fi
done
```

- Replace `mybucket` with the bucket name from `kestra.storage.minio.bucket`.

---

## Azure Blob Storage

```bash
#!/bin/bash

# Set your Azure Storage account and bucket (container) name
ACCOUNT_NAME="myaccount"
BUCKET_NAME="mybucket"

# Configurable destination tenant (default: 'main')
DEST_TENANT="${1:-main}"

# List of tenant folders to skip (don't move)
TENANTS=("main")

# Get all blob names
blob_names=$(az storage blob list --account-name "$ACCOUNT_NAME" --container-name "$BUCKET_NAME" --query "[].name" --output tsv)

# Separate top-level files and folders
top_files=()
top_folders=()

for name in $blob_names; do
    if [[ "$name" == */* ]]; then
        top_folder=$(echo "$name" | cut -d'/' -f1)
        top_folders+=("$top_folder")
    else
        top_files+=("$name")
    fi
done

# Deduplicate folder list
unique_folders=($(printf "%s\n" "${top_folders[@]}" | sort | uniq))

# Remove from top_files any that match folder names
clean_files=()
for file in "${top_files[@]}"; do
    skip=false
    for folder in "${unique_folders[@]}"; do
        if [[ "$file" == "$folder" ]]; then
            skip=true
            break
        fi
    done
    if [ "$skip" = false ]; then
        clean_files+=("$file")
    fi
done

# Process top-level files
for file in "${clean_files[@]}"; do
    skip=false
    for tenant in "${TENANTS[@]}"; do
        if [[ "$file" == "$tenant" ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = false ]; then
        echo "Copying single file $file -> $DEST_TENANT/$file"
        az storage blob copy start \
            --account-name "$ACCOUNT_NAME" \
            --destination-container "$BUCKET_NAME" \
            --destination-blob "$DEST_TENANT/$file" \
            --source-uri "$(az storage blob url --account-name "$ACCOUNT_NAME" --container-name "$BUCKET_NAME" --name "$file" -o tsv)"
    fi
done

# Process top-level folders (batch copy)
for folder in "${unique_folders[@]}"; do
    skip=false
    for tenant in "${TENANTS[@]}"; do
        if [[ "$folder" == "$tenant" ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = false ]; then
        echo "Batch copying $folder/* -> $DEST_TENANT/"
        az storage blob copy start-batch \
            --account-name "$ACCOUNT_NAME" \
            --destination-container "$BUCKET_NAME" \
            --destination-path "$DEST_TENANT" \
            --source-container "$BUCKET_NAME" \
            --pattern "$folder/*"
    fi
done

echo "Migration finished!"
```

- `BUCKET_NAME` is configured under `kestra.storage.azure.container`.
- For OSS users, the destination tenant is always `main`.

---

## S3 Storage

```bash
#!/bin/bash

BUCKET="mybucket"
DEST_TENANT="${1:-main}"
TENANTS=("main")

echo "Starting S3 tenant migration → destination tenant: $DEST_TENANT"

# List all keys, no leading slash
aws s3 ls s3://$BUCKET --recursive | awk '{print $4}' | sed 's|^/||' | grep -v '^$' | while read -r key; do
    # Check top-level folder or file
    top_level=$(echo "$key" | cut -d'/' -f1)

    # Skip if key is already under an existing tenant
    skip=false
    for tenant in "${TENANTS[@]}"; do
        if [[ "$top_level" == "$tenant" ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = false ]; then
        new_key="$DEST_TENANT/$key"
        echo "Copying s3://$BUCKET/$key → s3://$BUCKET/$new_key"

        # Copy object to tenant folder
        aws s3 cp "s3://$BUCKET/$key" "s3://$BUCKET/$new_key"
    fi
done

echo "Tenant migration finished!"
```

- `BUCKET` is configured under `kestra.storage.s3.bucket`.
- For OSS users, the destination tenant is always `main`.

---

## GCS Storage

```bash
#!/bin/bash


BUCKET="gs://bucket"
DEST_TENANT="${1:-main}"  # Default tenant is 'main' if not specified
TENANTS=("main")

echo "Starting GCS tenant migration on $BUCKET → destination tenant: $DEST_TENANT"

# Get all object keys (strip bucket prefix)
all_keys=$(gsutil ls "$BUCKET/**" | sed "s|$BUCKET/||")

# Collect top-level folders and files
declare -A top_folders
declare -a top_files

for key in $all_keys; do
    # Skip folder markers (end with /)
    if [[ "$key" == */ ]]; then
        top_folder=$(echo "$key" | cut -d'/' -f1)
        top_folders["$top_folder"]=1
    else
        top_level=$(echo "$key" | cut -d'/' -f1)
        if [[ "$key" != */* ]]; then
            # Root-level file (no folder)
            top_files+=("$key")
        else
            top_folders["$top_level"]=1
        fi
    fi
done

# Process top-level files
for file in "${top_files[@]}"; do
    skip=false
    for tenant in "${TENANTS[@]}"; do
        if [[ "$file" == "$tenant" ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = false ]; then
        new_key="$DEST_TENANT/$file"
        echo "Copying file $BUCKET/$file → $BUCKET/$new_key"
        gsutil cp "$BUCKET/$file" "$BUCKET/$new_key"
        # Optional: gsutil rm "$BUCKET/$file"
    fi
done

# Process top-level folders
for folder in "${!top_folders[@]}"; do
    skip=false
    for tenant in "${TENANTS[@]}"; do
        if [[ "$folder" == "$tenant" ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = false ]; then
        echo "Batch copying folder $BUCKET/$folder/** → $BUCKET/$DEST_TENANT/"
        gsutil cp -r "$BUCKET/$folder" "$BUCKET/$DEST_TENANT/"
        # Optional: gsutil rm -r "$BUCKET/$folder"
    fi
done

echo "Tenant migration finished!"
```

- `BUCKET` is configured under `kestra.storage.gcs.bucket`.
- For OSS users, the destination tenant is always `main`.