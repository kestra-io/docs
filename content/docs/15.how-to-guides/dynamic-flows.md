---
title: Dynamic Flows
icon: /docs/icons/tutorial.svg
stage: Intermediate
topics:
  - Kestra Concepts
---

Implement dynamic flows in Kestra.

In this guide, we will look at ways to implement dynamic flows in Kestra.

## Dynamic Flow using Inputs

In this method, we will create a flow as a template, and the dynamic values in the template can then be filled using Kestra inputs to generate the desired flow. Let us see this with the help of an example.

Here, we will create a sample flow that downloads CSV data using the HTTP Download task and then loads the data to a PostgreSQL table. Such a dynamic flow can be helpful when you have new HTTP URLs getting generated on a regular cadence, and you need to pull in the latest data from the new HTTP URL to upload to a table.

The flow will take the HTTP URL and the PostgreSQL database connection details as inputs. This leads to a dynamic flow, as the same flow can then be utilized with different HTTP URLs and different PostgreSQL databases and tables.

```yaml
id: dynamic_flow
namespace: company.team

inputs:
  - id: http_url
    type: STRING
    defaults: "https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv"

  - id: postgres_host
    type: STRING
    defaults: "localhost"

  - id: postgres_port
    type: STRING
    defaults: "5432"

  - id: postgres_db
    type: STRING
    defaults: "postgres"

  - id: postgres_table
    type: STRING

  - id: postgres_username
    type: STRING
    
  - id: postgres_password
    type: STRING

tasks:
  - id: http_download
    type: io.kestra.plugin.core.http.Download
    uri: "{{ inputs.http_url }}"

  - id: copyin
    type: io.kestra.plugin.jdbc.postgresql.CopyIn
    url: "jdbc:postgresql://{{ inputs.postgres_host }}:{{ inputs.postgres_port }}/{{ inputs.postgres_db }}"
    username: "{{ inputs.postgres_username }}"
    password: "{{ inputs.postgres_password }}"
    format: CSV
    from: "{{ outputs.http_download.uri }}"
    table: "{{ inputs.postgres_table }}"
    header: true
```

As can be seen from the above flow, it is dynamic as all its important parameters are controlled via inputs.

## Dynamic Flow using Code

We can write code in any language to generate the dynamic flow, and then upload the flow to Kestra. Let us understand this with the help of an example.

We will create a dynamic flow using python which downloads a CSV file using the HTTP Download task and upload the contents into PostgreSQL table. Say, we want to extract the data from multiple HTTP URLs and upload the data to corresponding a PostgreSQL table. We can, in parallel, start the process of downloading the data from HTTP URL and uploading it to PostgreSQL table. For two items, products and orders, this is how our flow should look like:

```yaml
id: dynamic_flow
namespace: company.team
tasks:
  - id: parallel
    type: io.kestra.plugin.core.flow.Parallel
    tasks:
      - id: sequential_task_0
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: http_download_0
            type: io.kestra.plugin.core.http.Download
            uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/products.csv
          - id: postgres_upload_0
            type: io.kestra.plugin.jdbc.postgresql.CopyIn
            url: jdbc:postgresql://{{ kv('postgres_host', 'company.infra') }}:{{ kv('postgres_port',
              'company.infra') }}/{{ kv('postgres_db', 'company.infra') }}
            username: "{{ secret('POSTGRES_USERNAME') }}"
            password: "{{ secret('POSTGRES_PASSWORD') }}"
            format: CSV
            from: '{{ outputs.http_download_0.uri }}'
            table: products
            header: true
      - id: sequential_task_1
        type: io.kestra.plugin.core.flow.Sequential
        tasks:
          - id: http_download_1
            type: io.kestra.plugin.core.http.Download
            uri: https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv
          - id: postgres_upload_1
            type: io.kestra.plugin.jdbc.postgresql.CopyIn
            url: jdbc:postgresql://{{ kv('postgres_host', 'company.infra') }}:{{ kv('postgres_port',
              'company.infra') }}/{{ kv('postgres_db', 'company.infra') }}
            username: "{{ secret('POSTGRES_USERNAME') }}"
            password: "{{ secret('POSTGRES_PASSWORD') }}"
            format: CSV
            from: '{{ outputs.http_download_1.uri }}'
            table: orders
            header: true
```

In order to generate this flow dynamically for any number of items, we will use the following python code.

```python
import os
from ruamel.yaml import YAML

# Get the items from the environment variable and split it by comma(,)
items = os.getenv('EXTRACT_ITEMS', "products,orders").split(",")

def http_download_task(idx, item):
  """Create HTTP Download task based on the item. The task id and uri will get dynamically generated based on `idx` and `item` respectively.
  """
  return  {
    "id": f"http_download_{str(idx)}",
    "type": "io.kestra.plugin.core.http.Download",
    "uri": f"https://huggingface.co/datasets/kestra/datasets/raw/main/csv/{item}.csv"
  }

def postgres_upload_task(idx, item):
  """Create postgres CopyIn task to upload the data from CSV to the corresponding postgres table.
  """
  return {
    "id": f"postgres_upload_{str(idx)}",
    "type": "io.kestra.plugin.jdbc.postgresql.CopyIn",
    "url": "jdbc:postgresql://" + "{{ kv('postgres_host', 'company.infra') }}:{{ kv('postgres_port', 'company.infra') }}/{{ kv('postgres_db', 'company.infra') }}",
    "username": "{{ secret('POSTGRES_USERNAME') }}",
    "password": "{{ secret('POSTGRES_PASSWORD') }}",
    "format": "CSV",
    "from": "{{ outputs.http_download_" + str(idx) + ".uri }}",
    "table": f"{item}",
    "header": True
  }

def create_sequential_task(idx, task_list):
  """Create Sequential task for every item which will have two tasks:
  1. Download the CSV data using HTTP Download task
  2. Upload the CSV file into the corresponding postgres table using CopyIn task
  """
  return {
    "id": f"sequential_task_{str(idx)}",
    "type": "io.kestra.plugin.core.flow.Sequential",
    "tasks": task_list
  }

tasks_per_item = []

# Iterate over the items and generate Sequential task for each item, and append it to `tasks_per_item`
for idx, item in enumerate(items):
  sequential_tasks = []
  sequential_tasks.append(http_download_task(idx, item))
  sequential_tasks.append(postgres_upload_task(idx, item))
  sequential_task = create_sequential_task(idx, sequential_tasks)
  tasks_per_item.append(sequential_task)

# Generate the dynamic flow
kestra_flow = {
    "id": os.getenv('FLOW_ID', "postgres_upload_flow"),
    "namespace": os.getenv('FLOW_NAMESPACE', "company.team"),
    "tasks": [
        {
            "id": "parallel",
            "type": "io.kestra.plugin.core.flow.Parallel",
            "tasks": tasks_per_item
        }
    ]
}

yaml = YAML()
yaml.indent(mapping=2, sequence=4, offset=2)
yaml.preserve_quotes = True

# Write the generated dynamic flow in yaml format in `kestra_flow.yaml` file
output_path = "kestra_flow.yaml"
with open(output_path, "w") as f:
    yaml.dump(kestra_flow, f)
```

The above python code will generate a dynamic flow with multiple Sequential tasks that will download the data from an HTTP URL and upload the CSV into the corresponding PostgreSQL table. You can write the above code in a namespace file, say `dynamic_flow.py`.

Next, we will write a Kestra flow that will invoke the `dynamic_flow.py` python script and load the generated dynamic flow into Kestra.

```yaml
id: generate_dynamic_flow
namespace: company.team

inputs:
  - id: flow_id
    type: STRING
    description: Name for the dynamic flow to be created
    defaults: dynamic_flow

  - id: flow_namespace
    type: STRING
    description: Namespace in which the dynamic flow is to be created
    defaults: company.team

  - id: extract_items
    type: STRING
    description: Comma separated list of items to be extracted
    defaults: products,orders

  - id: kestra_host
    type: STRING
    description: Your Kestra hostname
    defaults: "localhost:8080"

tasks:
  - id: generate_kestra_flow
    type: io.kestra.plugin.scripts.python.Commands
    env:
      FLOW_ID: "{{ inputs.flow_id }}"
      FLOW_NAMESPACE: "{{ inputs.flow_namespace }}"
      EXTRACT_ITEMS: "{{ inputs.extract_items }}"
    beforeCommands: 
      - pip install -q ruamel.yaml
    namespaceFiles:
      enabled: true
    inputFiles:
      script.py: "{{ read('dynamic_flow.py') }}"
    commands:
      - python script.py
    outputFiles:
      - "*.yaml"

  - id: create_flow
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      flow.yaml: "{{ outputs.create_kestra_flow.outputFiles['kestra_flow.yaml'] }}"
    beforeCommands: 
      - apt-get update
      - apt-get -y install curl
    commands:
      - curl -X POST http://{{inputs.kestra_host}}/api/v1/main/flows/import -F fileUpload=@flow.yaml
      - echo "Executing the flow from http://{{inputs.kestra_host}}/ui/flows/edit/{{ inputs.flow_namespace }}/{{ inputs.flow_id }}"
  
  - id: subflow
    type: io.kestra.plugin.core.flow.Subflow
    namespace: "{{ inputs.flow_namespace }}"
    flowId: "{{ inputs.flow_id }}"
    wait: true
    transmitFailed: true
```

The flow has the following tasks:

1. generate_kestra_flow: This task invokes the `dynamic_flow.py` and generates the dynamic flow by running the Python code. The environment variables like `FLOW_ID`, `FLOW_NAMESPACE`, and `EXTRACT_ITEMS` are provided in the task, which are then used by the Python script to dynamically generate the flow.

2. create_flow: This task creates the flow in Kestra by uploading the yaml file containing the dynamically generated flow.

3. subflow: This task triggers the newly created dynamic flow.

Thus, you can generate the dynamic flow by generating it in the language of your choice and then loading it into Kestra.

## Dynamic Flow using Terraform

Yet another way of generating dynamic flows in Kestra is using Terraform templates. Check out the detailed guide on implementing dynamic flows using [Terraform templating](/docs/how-to-guides/terraform-templating).
