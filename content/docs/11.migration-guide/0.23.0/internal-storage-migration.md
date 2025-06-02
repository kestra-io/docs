---
title: Internal Storage Migration Guide for S3 and GCS Users
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["EE"]
---

## Internal Storage Migration Guide for S3 and GCS users to fix double slash

Enterprise users who don’t use the `defaultTenant` but use S3 or GCS as internal storage need to run the `root_slash_migration.bash` script for their provider to fix the double slash issue. This is required due to a breaking change that has been introduced in v0.23 for **GCS** and **S3** storage to remove the leading root slash. 

Example of how the storage path looks like before and after the change:

- Before 0.23: `gs://ee-default-22//company/team/_files/test.txt`
- After 0.23: `gs://ee-default-22/company/team/_files/test.txt`

Make sure to run the script for your provider. Otherwise, Kestra won’t be able to find your internal storage files anymore:

### GCS storage root slash migration script:

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

### S3 root slash migration script:

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

---
