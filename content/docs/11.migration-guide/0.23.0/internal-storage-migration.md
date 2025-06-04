---
title: Internal Storage Migration Guide for S3 and GCS Users
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS","EE"]
---

## Internal Storage Migration Guide for S3 and GCS users to fix double slash

For users of S3 or GCS as internal storage, Kestra now removes the leading root slash in all storage paths. Storage keys now have a single slash separator, not a double slash. This helps display internal storage objects [in various cloud storage interfaces](https://github.com/kestra-io/kestra/issues/3933).

Below is an example of how the storage path looks like before and after the change (note the double slash before the namespace `company`):

- Before 0.23: `gs://ee-default-22//company/team/_files/test.txt`
- After 0.23: `gs://ee-default-22/company/team/_files/test.txt`

Make sure to run the followings script for your provider. Otherwise, Kestra won’t be able to find your internal storage files anymore.

### GCS storage root slash migration script

```bash
#!/bin/bash

BUCKET="gs://mybucket"

echo "Starting GCS root slash cleanup on bucket $BUCKET"

# List all objects starting with /
gsutil ls "$BUCKET/**" | grep "$BUCKET//" | while read -r full_path; do
    # Extract just the key (remove bucket prefix)
    key="${full_path#${BUCKET}/}"

    # Skip folder markers (if any)
    if [[ "$key" == */ ]]; then
        echo "Skipping folder marker: $key"
        continue
    fi

    # Remove leading slash
    clean_key="${key#/}"

    echo "Copying $BUCKET/$key → $BUCKET/$clean_key"

    # Copy to clean location
    gsutil cp "$BUCKET/$key" "$BUCKET/$clean_key"
done

echo "Cleanup finished!"
```

### S3 root slash migration script

```bash
#!/bin/bash

BUCKET="mybucket"

aws s3 ls s3://$BUCKET --recursive | awk '{print $4}' | grep '^/' | grep -v '/$' | while read -r key; do
    # Strip the leading slash
    clean_key="${key#/}"

    echo "Copying s3://$BUCKET/$key → s3://$BUCKET/$clean_key"

    # Copy to new key without leading slash
    aws s3 cp "s3://$BUCKET/$key" "s3://$BUCKET/$clean_key"

    # Optional: Delete original after copy succeeds
    # aws s3 rm "s3://$BUCKET/$key"
done

echo "Migration finished!"
```


### Migrating Files Using Graphical User Interfaces (GUI)

For users who prefer not to use command-line scripts or are limited by their environment (e.g., Windows Server without shell access), migration can be accomplished with graphical tools. Below are guidelines for each storage type.

#### Windows: Using File Explorer

If your internal storage is a local directory (or a network drive), you can manually move or copy files:

1. **Open File Explorer** and navigate to your storage directory.
2. **Locate files or folders** with a double leading slash (e.g., `\\company\team\_files\test.txt`).
3. **Rename or move** files to remove the extra slash, so the path matches the new structure (e.g., `\company\team\_files\test.txt`).
4. Verify that no double slashes remain in the directory paths.

#### S3/Cloudflare R2: Using Management Console

Most S3-compatible providers (including AWS S3, MinIO and Cloudflare R2) allow you to move or copy files directly in their web interfaces:

1. **Log in** to the AWS S3, MinIO or Cloudflare R2 management console.
2. **Navigate** to your bucket.
3. Use the console’s object browser to **locate files** with leading double slashes in the key name (may appear as objects or folders starting with `/`).
4. Use the **copy or move action** to duplicate the object to the correct key (without the leading slash), then **delete the original** if needed.

*Note: Some consoles may hide leading slashes or display objects as folders. Double-check object keys if you're unsure.*

#### Azure Blob Storage: Using Azure Portal

1. **Open Azure Portal** and go to your Blob Storage account.
2. In the **container**, browse for blobs with key names starting with a slash (`/`).
3. Use the **Azure Portal’s copy/move feature** (or Azure Storage Explorer app) to rename blobs without the leading slash.
4. Delete the original blobs after confirming a successful copy.

