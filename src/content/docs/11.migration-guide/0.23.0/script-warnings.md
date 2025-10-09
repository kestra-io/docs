---
title: No more WARNING state on script tasks when ERROR logs are present
icon: /docs/icons/migration-guide.svg
release: 0.23.0
editions: ["OSS", "EE"]
---

## Overview

We no longer set the task-run state to `Warning` if the script task emits some ERROR or WARNING logs and the `warningOnStdErr` [property is deprecated](https://github.com/kestra-io/plugin-scripts/issues/233). Script tasks will now always report a **SUCCESS** state if the Docker container exits with code 0, and a **FAILED** state for any non-zero exit code — ERROR or WARNING logs no longer influence the task run state.

Example flow:

```yaml
id: loguru
namespace: company.team

inputs:
  - id: nr_logs
    type: INT
    defaults: 100

tasks:
  - id: reproducer
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
    containerImage: ghcr.io/kestra-io/pydata:latest
    script: |
      from loguru import logger
      from faker import Faker
      import time
      import sys

      logger.remove()
      logger.add(sys.stdout, level="DEBUG")
      logger.add(sys.stderr, level="DEBUG")

      def generate_logs(fake, num_logs):
          logger.error("Starting to generate log messages")
          for _ in range(num_logs):
              log_message = fake.sentence()
              logger.warning(log_message)
              time.sleep(0.01)
          logger.warning("Finished generating log messages")

      if __name__ == "__main__":
          faker_ = Faker()
          generate_logs(faker_, int("{{ inputs.nr_logs }}"))
```

Before this change, the flow would end in WARNING; now it ends in SUCCESS.
