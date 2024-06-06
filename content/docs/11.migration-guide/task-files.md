---
title: Depreciation of LocalFiles and outputDir
icon: /docs/icons/migration-guide.svg
release: 0.17.0
---

`LocalFiles` and `outputDir` were depreciated in Kestra 0.17.0. Here is why:

1. **outputDir**: the `{{ outputDir }}` expression has been deprecated due to overlapping functionality available through the `outputFiles` property which is more flexible.
2. **LocalFiles**: the `LocalFiles` feature was initially introduced to allow injecting additional files into the script task's `WorkingDirectory`. However, this feature was confusing as there is nothing local about these files, and with the introduction of `inputFiles` to the `WorkingDirectory`, it became redundant. We recommend using the `inputFiles` property instead of `LocalFiles` to inject files into the script task's `WorkingDirectory`. The example below demonstrates how to do that:

```yaml
id: apiJSONtoMongoDB
namespace: release

tasks:
- id: wdir
  type: io.kestra.plugin.core.flow.WorkingDirectory
  outputFiles:
    - output.json
  inputFiles:
    query.sql: |
      SELECT sum(total) as total, avg(quantity) as avg_quantity
      FROM sales;
  tasks:
    - id: inlineScript
      type: io.kestra.plugin.scripts.python.Script
      taskRunner:
        type: io.kestra.plugin.scripts.runner.docker.Docker
      containerImage: python:3.11-slim
      beforeCommands:
        - pip install requests kestra > /dev/null
      warningOnStdErr: false
      script: |
        import requests
        import json
        from kestra import Kestra

        with open('query.sql', 'r') as input_file:
            sql = input_file.read()

        response = requests.get('https://api.github.com')
        data = response.json()

        with open('output.json', 'w') as output_file:
            json.dump(data, output_file)

        Kestra.outputs({'receivedSQL': sql, 'status': response.status_code})

- id: loadToMongoDB
  type: io.kestra.plugin.mongodb.Load
  connection:
    uri: mongodb://host.docker.internal:27017/
  database: local
  collection: github
  from: "{{ outputs.wdir.uris['output.json'] }}"
```

## Examples

To help you migrate your flows, here's a few examples of how you might update your flow to use the new format in 0.17.0.

### `outputDir`

Before:

```yaml
id: getting_started_output
namespace: dev

inputs:
  - id: api_url
    type: STRING
    defaults: https://dummyjson.com/products

tasks:
  - id: api
    type: io.kestra.plugin.fs.http.Request
    uri: "{{ inputs.api_url }}"
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    docker:
      image: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    script: |
      import polars as pl
      data = {{outputs.api.body | jq('.products') | first}}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("{{outputDir}}/products.csv")
```

After:

```yaml
id: getting_started_output
namespace: dev

inputs:
  - id: api_url
    type: STRING
    defaults: https://dummyjson.com/products

tasks:
  - id: api
    type: io.kestra.plugin.fs.http.Request
    uri: "{{ inputs.api_url }}"
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    docker:
      image: python:slim
    beforeCommands:
      - pip install polars
    warningOnStdErr: false
    outputFiles:
      - "products.csv"
    script: |
      import polars as pl
      data = {{outputs.api.body | jq('.products') | first}}
      df = pl.from_dicts(data)
      df.glimpse()
      df.select(["brand", "price"]).write_csv("products.csv")
```

### `LocalFiles`

Before:

```yaml
id: pip
namespace: dev
tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    tasks:
    - id: pip
      type: io.kestra.plugin.core.storage.LocalFiles
      inputs:
        requirements.txt: |
          kestra>=0.6.0
          pandas>=1.3.5
          requests>=2.31.0
    - id: pythonScript
      type: io.kestra.plugin.scripts.python.Script
      docker:
        image: python:3.11-slim
      beforeCommands:
        - pip install -r requirements.txt > /dev/null
      warningOnStdErr: false
      script: |
        import requests
        import kestra
        import pandas as pd
        print(f"requests version: {requests.__version__}")
        print(f"pandas version: {pd.__version__}")
        methods = [i for i in dir(kestra.Kestra) if not i.startswith("_")]
        print(f"Kestra methods: {methods}")
```

After:

```yaml
id: pip
namespace: dev
tasks:
  - id: wdir
    type: io.kestra.plugin.core.flow.WorkingDirectory
    inputFiles:
      requirements.txt: |
          kestra>=0.6.0
          pandas>=1.3.5
          requests>=2.31.0
    tasks:
    - id: pythonScript
      type: io.kestra.plugin.scripts.python.Script
      docker:
        image: python:3.11-slim
      beforeCommands:
        - pip install -r requirements.txt > /dev/null
      warningOnStdErr: false
      script: |
        import requests
        import kestra
        import pandas as pd
        print(f"requests version: {requests.__version__}")
        print(f"pandas version: {pd.__version__}")
        methods = [i for i in dir(kestra.Kestra) if not i.startswith("_")]
        print(f"Kestra methods: {methods}")
```