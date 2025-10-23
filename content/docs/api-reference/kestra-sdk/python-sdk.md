---
title: Kestra Python SDK
icon: /docs/icons/api.svg
release: 1.0.0
---

## Overview

To demonstrate how to use the SDKs, let's create a simple flow that logs a message. This example assumes you have a Kestra instance running and accessible via the `KESTRA_HOST` environment variable, along with your username and password set in `.env` file such as:

```
KESTRA_HOST=http://localhost:8080
KESTRA_USERNAME=admin@kestra.io
KESTRA_PASSWORD=Admin1234
```

First, create a virtual environment and install the [Python SDK](https://github.com/kestra-io/client-sdk/blob/main/README_PYTHON_SDK.md):

```bash
uv venv
source .venv/bin/activate
uv pip install kestrapy
uv pip install python-dotenv # For loading auth environment variables from .env file
```

Now, use the following Python script to create or update a flow that logs a message:

```python
import kestra_api_client
from dotenv import load_dotenv
import os
import json
load_dotenv()
configuration = kestra_api_client.Configuration(
    host = os.environ.get("KESTRA_HOST"),
    username = os.environ.get("KESTRA_USERNAME"),
    password = os.environ.get("KESTRA_PASSWORD")
)
api_client = kestra_api_client.ApiClient(configuration)
api_instance = kestra_api_client.FlowsApi(api_client)
tenant = 'main'
flow_id = 'sdk'
namespace = 'demo'
body = f"""id: {flow_id}
namespace: {namespace}
tasks:
  - id: hello
    type: io.kestra.plugin.core.log.Log
    message: Hello from the SDK! 👋
"""
try:
    api_response = api_instance.create_flow(tenant, body)
    print(api_response)
except kestra_api_client.rest.ApiException as e:
    if e.status == 422 and "Flow id already exists" in json.loads(e.body).get("message", ""):
        try:
            api_response = api_instance.update_flow(flow_id, namespace, tenant, body)
            print(api_response)
        except ValueError:
            print("Flow updated successfully")
    else:
        print(e)
```

In the Kestra UI, there will now be a flow with the ID `sdk` that logs the hello message.
