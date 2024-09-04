---
title: JVM
icon: /docs/icons/admin.svg
---

How to configure options for the JVM.

All JVM options can be passed in an environment variable named `JAVA_OPTS`. You can use it to change all JVM options available, such as memory, encoding, etc.

Example:

```shell
export JAVA_OPTS="-Duser.timezone=Europe/Paris"
```

### `user.timezone`: Timezone
By default, Kestra will handle all dates using your system's timezone. You can change the timezone with JVM options.

Changing the timezone will mostly affect:
* **scheduler**: by default, all schedule dates are UTC; changing the Java timezone will allow scheduling the flow in your timezone.
* **logs display**: in your configured timezone.

