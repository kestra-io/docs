---
title: Pebble Templating with Namespace Files
icon: /docs/icons/best-practices.svg
---

You cannot directly use pebble templating inside the namespace files as the pebble templates would not be rendered. You can achieve these in broadly two ways:

1. Using inline script with pebble templating
2. Using namespace files with argparse

## Using inline script with pebble templating

You can write the script inline in your flow, and use pebble templating as part of this inline script. Here is an example flow having pebble templating within the inline script:

```yaml
id: pebble_templeting_inline
namespace: company.team

inputs:
  - id: uri
    type: URI
    defaults: https://www.google.com/

tasks:
  - id: inline_script
    type: io.kestra.plugin.scripts.python.Script
    runner: DOCKER
    docker:
      image: ghcr.io/kestra-io/pydata:latest
    script: |
      import requests

      url = "{{ inputs.uri }}"
      response = requests.get(url)

      if response.status_code == 200:
          print(response.text)
      else:
          print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
```

In this example, the pebble templating within the inline script like `{{ inputs.uri }}` would be evaluated, and rendered appropriately.

This approach is very convenient for scripts that are specific to the flow, and does not have multiple usages. In case of multiple usages, this can lead to script code getting duplicated across multiple flows.

## Using namespace files with argparse

Another option to leverage pebble templates in scripts is using argparse. In this case, we define the scripts as namespace files. You can use the Editor to define the script.

![namespace_file](../../best-practices/namespace_file.png)

Here is the same script for reference:

```python
import argparse
import requests

# Setup command line argument parsing
parser = argparse.ArgumentParser(description="Fetch the content of a given URL")
parser.add_argument("url", type=str, help="The URL to fetch")
args = parser.parse_args()

# Perform the GET request
response = requests.get(args.url)

# Check if the request was successful
if response.status_code == 200:
    # Print the content of the page
    print(response.text)
else:
    print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
```

You can pass the arguments to this script using pebble templates. The pebble template will be rendered, and the evaluated values will be passed to the script via argparse. Here is an example flow:

```yaml
id: myscript
namespace: company.team

inputs:
  - id: uri
    type: URI
    defaults: https://www.google.com/

tasks:
  - id: hello
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
    runner: DOCKER
    docker:
      image: ghcr.io/kestra-io/pydata:latest
    commands:
      - python main.py "{{ inputs.uri }}"
```

Using this method, the script grows longer due to handling of arguments using argparse. This can be clearly seen by comparing the script in the Editor to the inline script used in the first approach. However, this method is very helpful from reusability perspective where the same script can be used in multiple flows without any code duplication of the script.
