---
title: Tasks Configuration
icon: /docs/icons/admin.svg
---

This section eplains various configuration options for tasks in Kestra.

## Task Defaults

### `kestra.tasks.defaults`
You can provide task defaults that will be applied to each task on your cluster **if a property is not defined** on flows or tasks. Task defaults allow ensuring a property is defined at a default value for these tasks.

```yaml
kestra:
  tasks:
    defaults:
    - type: io.kestra.plugin.core.log.Log
      values:
        level: ERROR
```

Forced task defaults ensure a property is set cluster-wise for a task, and no task can override it.
Forced task defaults can be handy to enforce security concerns, for example, by enforcing Shell tasks to run as Docker containers.

```yaml
kestra:
  tasks:
    defaults:
      - type: io.kestra.plugin.scripts.shell.Script
        forced: true
        values:
          runner: DOCKER
```


## Docker configuration


### `kestra.tasks.scripts.docker.volume-enabled`
Volumes mount are disabled by default for security reasons, you can enabled it with this configurations:
```yaml
kestra:
  tasks:
    scripts:
      docker:
        volume-enabled: true
```

## Temporary storage configuration
Kestra writes temporary files during task processing. By default, files will be created on `/tmp`, but you can change the location with this configuration:

```yaml
kestra:
  tasks:
    tmp-dir:
      path: /home/kestra/tmp
```

**Note:** The `tmp-dir` path must be aligned to the volume path otherwise Kestra will not know what directory to mount for the `tmp` directory. 
```yaml
volumes:
  - kestra-data:/app/storage
  - /var/run/docker.sock:/var/run/docker.sock
  - /home/kestra:/home/kestra
```
In this example, `/home/kestra:/home/kestra` matches the tasks `tmp-dir` field.
