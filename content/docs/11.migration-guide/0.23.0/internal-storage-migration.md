---
title: Internal Storage Migration Guide for S3 and GCS Users
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS","EE"]
---

## Internal storage migration guide for S3 and GCS users to fix double slash

For users of S3 or GCS as internal storage, Kestra now removes the leading root slash in all storage paths. Storage keys now have a single slash separator, not a double slash. This helps display internal storage objects [in various cloud storage interfaces](https://github.com/kestra-io/kestra/issues/3933).

Below is an example of how the storage path looks like before and after the change (note the double slash before the namespace `company`):

- Before 0.23: `gs://ee-default-22//company/team/_files/test.txt`
- After 0.23: `gs://ee-default-22/company/team/_files/test.txt`

Make sure to run the following script for your provider. Otherwise, Kestra won’t be able to find your internal storage files anymore.

:::alert{type="warning"}
Before taking any action to fix the double slash issue, Open-source users **MUST** follow the steps in the [OSS Tenant Migration Guide](tenant-migration-oss.md) and Enterprise users **MUST** follow the steps in the [EE Tenant Migration Guide](tenant-migration-ee.md).
:::

### GCS storage root slash migration script

```bash
gcloud storage cp -r "gs://mybucket//*" gs://mybucket/
```

After running the script, the old files can be removed using:
```bash
gsutil rm -r "gs://mybucket//**
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

For users who prefer not to use command-line scripts, migration can be accomplished with graphical tools.

Most S3-compatible providers (including AWS S3 and Cloudflare R2) allow you to move or copy files directly in their web interfaces:

1. **Log in** to the AWS S3 or Cloudflare R2 management console.
2. **Navigate** to your bucket.
3. Use the console’s object browser to **locate files** with leading double slashes in the key name (may appear as objects or folders starting with `/`).
4. Use the **copy or move action** to duplicate the object to the correct key (without the leading slash), then **delete the original** if needed.

*Note: Some consoles may hide leading slashes or display objects as folders. Double-check object keys if you're unsure.*
