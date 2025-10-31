---
title: Configure Local MinIO Storage for Kestra
icon: /docs/icons/minio.svg
stage: Intermediate
topics:
- DevOps
- Object Storage
---

Set up and verify a local [MinIO](https://min.io/) storage backend for Kestra using the `mc` CLI and Docker.

---

:::alert{type="warning"}
This guide is intended for **local development and testing only**.
MinIO is configured in gateway mode and exposed on `localhost`, without TLS or public access.
**Do not use this setup in production** without additional security measures (e.g., HTTPS, access controls, and network isolation).
:::

## Install and Configure `mc` (MinIO Client)

Download and install the MinIO Client (`mc`) tool using the following command:

```sh
curl https://dl.min.io/client/mc/release/linux-amd64/mc --create-dirs -o $HOME/minio-binaries/mc && \
chmod +x $HOME/minio-binaries/mc && \
export PATH=$PATH:$HOME/minio-binaries/
```

### Remove and Recreate Local Alias

Remove any existing local alias:

```sh
mc alias remove local
```

Recreate the alias with your MinIO access credentials:

```sh
mc alias set local http://localhost:9000 YOUR_ACCESS_KEY YOUR_SECRET_KEY
```

### Create a Local Bucket

Create the bucket where outputs will be stored:

```sh
mc mb local/your-bucket
```

## Start MinIO Server

Run the MinIO Docker container using the dedicated CI Compose file (e.g., from [kestra-io/storage-minio](https://github.com/kestra-io/storage-minio/)):

```sh
docker compose -f docker-compose-ci.yml up
```

## Configure Kestra for MinIO Storage

Update your `application-psql.yml` (or other relevant configuration file) under the `kestra:` section:

```yaml
storage:
  type: minio
  minio:
    endpoint: localhost
    port: 9000
    bucket: your-bucket
    access-key: YOUR_ACCESS_KEY
    secret-key: YOUR_SECRET_KEY
```

## Launch Kestra

Start Kestra as usual. Ensure the updated configuration file is correctly mounted or included.


## Test with a Flow that Produces Outputs

Here is a sample flow that generates output files and logs intermediate data:

```yaml
id: alligator_743987
namespace: company.team

tasks:
  - id: pass_output
    type: io.kestra.plugin.core.debug.Return
    format: hello

  - id: py_outputs
    type: io.kestra.plugin.scripts.python.Script
    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      containerImage: ghcr.io/kestra-io/pydata:latest
    outputFiles:
      - myoutput.json
    script: |
      import json
      from kestra import Kestra
      my_kv_pair = {'mykey': 'from Kestra'}
      Kestra.outputs(my_kv_pair)
      with open('myoutput.json', 'w') as f:
          json.dump(my_kv_pair, f)

  - id: take_inputs
    type: io.kestra.plugin.core.log.Log
    message: |
      data from previous tasks: {{ outputs.pass_output.value }} and {{ outputs.py_outputs.vars.mykey }}

  - id: check_output_file
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat {{ outputs.py_outputs.outputFiles['myoutput.json'] }}
```

## Verify Output in MinIO Bucket

You can now validate that the output file is stored in the MinIO bucket:

```sh
mc cat local/your-bucket/main/company/team/alligator-743987/executions/23z9cJWEa23kNAxu6sm0CT/tasks/py-outputs/5kxYRM7UqUurvnpVNvHca7/1noPFEiCFGPf2hcqjVzywu-myoutput.json
```

Note that you may need to replace the following placeholders with your own values:
- the bucket name (here `your-bucket`)
- the path (namespace) (here `company/team`)
- the flow id (here `alligator-743987`)
- the execution id (here `23z9cJWEa23kNAxu6sm0CT`)
- the task id (here `py-outputs`)
- and finally the output file name (here `1noPFEiCFGPf2hcqjVzywu-myoutput.json`)

The result should look like:

```json
{"mykey": "from Kestra"}%
```

You have successfully configured and validated MinIO as a local storage backend for Kestra.
