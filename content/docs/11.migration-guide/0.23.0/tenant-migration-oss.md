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

:::alert{type="warning"}
Before running the following migration scripts, you must completely shut down the main Kestra application. Running these scripts while the application is active may result in data corruption or migration failures.
:::

To add the tenantId field across your existing database (flows, executions, logs, etc.), use (with migrated being customizable):

```shell
kestra migrate default-tenant --dry-run
```

:::alert{type="info"}
Before running the migrate script, we recommend to do a complete database dump to preserve a restore point in case of any issues during the process.
- Use `--dry-run` to preview changes without modifying data.
- Re-run without the flag to execute the migration.
:::

:::alert{type="info"}
If you are using Helm for deployment, you can use an init container to run the migration:

```yaml
initContainers:
  - name: kestra-migrate
    image: kestra/kestra:v0.23.0
    command: ['sh', '-c', 'exec', '/app/kestra', 'migrate', 'default-tenant', '--tenant-id', 'migrated', '--tenant-name', 'migrated']
```

You can remove it after successful run (it has to be only executed once).
:::

## Internal storage migration guide from `defaultTenant` to a tenant

This section explains how to migrate internal storage data to ensure the tenant ID is included and properly queried by the application. Migration can be done via the provided scripts or directly through the management console of your cloud storage provider.

### **Who needs to perform this migration?**
- All OSS users need to run the migration script to ensure that the tenant ID is included in the internal storage paths.

## Local storage

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
    if [[ "$f" != "main" && "$f" != "undefined" ]]; then
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
DEST_TENANT="main"

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
DEST_TENANT="main"
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
DEST_TENANT="main"
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



### Migrating Files Using Graphical User Interfaces (GUI)

For users who prefer not to use command-line scripts or are limited by their environment (e.g., Windows Server without shell access), migration can be accomplished with graphical tools. Below are guidelines for each storage type.

---

#### Windows: Using File Explorer

If your internal storage is a local directory (or a network drive), you can manually move or copy files to migrate them into the `main` tenant folder:

1. **Open File Explorer** and navigate to your storage root directory as configured in `kestra.storage.local.base-path`.
2. **Identify all folders and files** at the root level that are *not* already under the `main` folder.

   * Example:

     ```
     base-path/
       main/
       foo/
       bar/
     ```

     You need to move `foo/` and `bar/` into `main/`.
3. **Select** all such folders/files, right-click and **Cut** (or **Copy**).
4. **Paste** into the `main` folder, e.g., `base-path/main/`.
5. **Delete** the originals from the root after confirming successful migration.

---

#### Local Storage on MacOS

1. **Open Finder** and go to your base storage directory.
2. **Select all files and folders** at the root that are not already in the `main` directory.
3. **Drag and drop** them into the `main` folder.
4. **Verify** that only the `main` folder remains at the root (along with its content).
5. Remove the originals if you used Copy instead of Move.

---

#### S3/MinIO/Cloudflare R2: Using Management Console for S3-compatible Storage

Most S3-compatible providers (AWS S3, MinIO, Cloudflare R2) allow file operations through their web UI:

1. **Log in** to your S3-compatible storage console and open the bucket (`kestra.storage.s3.bucket` or `kestra.storage.minio.bucket`).
2. **Locate all objects** at the root level (not under the `main` prefix/folder).
3. For each such file or folder:

   * Use the **Move** or **Rename** function to move it to the `main/` prefix (e.g., move `foo/file.txt` → `main/foo/file.txt`).
   * If your console only allows copy, use **Copy** then delete the original.
4. **Verify** that all files are now organized under the `main/` folder.
