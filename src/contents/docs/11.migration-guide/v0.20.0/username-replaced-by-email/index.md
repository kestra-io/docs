---
title: Usernames replaced by email addresses
description: Usernames replaced by emails in Kestra 0.20.0 (Enterprise). Run the migration command to update user identifiers to valid email addresses.
icon: /src/contents/docs/icons/migration-guide.svg
release: 0.20.0
editions: ["EE"]
---


## Usernames replaced by email addresses

Replace usernames by email addresses

Starting with Kestra 0.20, Kestra mandates the username to be an email address. If this is not the case within your instance, you can run the following CLI command to replace a username with the corresponding email for each user in the instance:

```yaml
./kestra auths users email-replace-username
```

If the email address is not set for the user or is invalid, Kestra will log those usernames so you can address those edge cases manually. If the username is already set as email, the above command will additionally set that value within the email property.
