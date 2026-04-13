---
title: Commands vs Script Tasks in Kestra
sidebarTitle: Commands and Script Tasks
icon: /src/contents/docs/icons/dev.svg
description: Understand the differences between Script and Commands tasks in Kestra and when to use each for your workflows.
---

Types of tasks for executing programming languages.

## Decide between Script and Commands tasks

<div class="video-container">
    <iframe src="https://www.youtube.com/embed/l-1MDlhV2oM?si=A--h-VEvmVNWW1TW" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

For each of the [supported languages](../00.languages/index.md) (e.g., Python, R, Node.js, Shell), Kestra provides two task types: **Script** and **Commands**.

1. **Script** tasks are written inline in the YAML flow configuration. They’re best for short scripts and make it easy to pass data from flow inputs and other tasks to your code.
2. **Commands** tasks are better for longer or multi-file scripts, typically added to Kestra as [namespace files](../../06.concepts/02.namespace-files/index.md).

The table below gives an overview of script-related tasks and example configuration snippets.

| Language   | Default `image`                                    | `beforeCommands` example                        | `Script` example                      | `Commands` example           |
|------------|----------------------------------------------------|-------------------------------------------------|--------------------------------------|------------------------------|
| Python     | python                                             | pip install requests kestra                     | print("Hello, World!")             | python hello.py              |
| R          | r-base                                             | Rscript -e "install.packages('dplyr')"        | print("Hello, World!")             | Rscript hello.R              |
| Julia      | julia                                              | julia -e 'using Pkg; Pkg.add("CSV")'          | println("Hello, World!")           | julia hello.jl              |
| Ruby       | ruby                                               | gem install httparty                            | puts "Hello, World!"               | ruby hello.rb                |
| Node.js    | node                                               | npm install json2csv                            | console.log('Hello, World!');        | node hello.js               |
| Shell      | ubuntu                                             | apt-get install curl                            | echo "Hello, World!"               | ./hello.bash                |
| PowerShell | mcr.microsoft.com/powershell                       | Install-Module -Name ImportExcel                | Write-Output "Hello, World!"       | .\hello.ps1                |
| Go         | golang                                             | go mod init go_script                            | println("Hello, World!")           | go run hello.go             |
| Deno       | denoland/deno                                      | N/A                                             | console.log("Hello from Kestra!")  | deno run main.ts            |
| Lua        | nickblah/lua                                       | N/A                                             | print("Hello from Kestra!")        | lua -e 'print("Hello from Kestra!")' |
| Bun        | over/bun                                           | bun add cowsay                                  | console.log("Hello, World!")       | bun run index.ts            |
| PHP        | php                                                | N/A                                             | echo "Hello, World!";              | php main.php                |
| Perl       | perl                                               | N/A                                             | print "Hello from Kestra!\n";     | perl -e 'print "Hello from Kestra!\n"' |
| Groovy     | groovy                                             | N/A                                             | println "Hello, $name!"            | groovy HelloWorld.groovy    |

**Full class names:**
- [io.kestra.plugin.scripts.python.Commands](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.commands)
- [io.kestra.plugin.scripts.python.Script](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script)
- [io.kestra.plugin.scripts.r.Commands](/plugins/plugin-script-r/io.kestra.plugin.scripts.r.commands)
- [io.kestra.plugin.scripts.r.Script](/plugins/plugin-script-r/io.kestra.plugin.scripts.r.script)
- [io.kestra.plugin.scripts.julia.Commands](/plugins/plugin-script-julia/io.kestra.plugin.scripts.julia.commands)
- [io.kestra.plugin.scripts.julia.Script](/plugins/plugin-script-julia/io.kestra.plugin.scripts.julia.script)
- [io.kestra.plugin.scripts.ruby.Commands](/plugins/plugin-script-ruby/io.kestra.plugin.scripts.ruby.commands)
- [io.kestra.plugin.scripts.ruby.Script](/plugins/plugin-script-ruby/io.kestra.plugin.scripts.ruby.script)
- [io.kestra.plugin.scripts.node.Commands](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.commands)
- [io.kestra.plugin.scripts.node.Script](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.script)
- [io.kestra.plugin.scripts.shell.Commands](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.commands)
- [io.kestra.plugin.scripts.shell.Script](/plugins/plugin-script-shell/io.kestra.plugin.scripts.shell.script)
- [io.kestra.plugin.scripts.powershell.Commands](/plugins/plugin-script-powershell/io.kestra.plugin.scripts.powershell.commands)
- [io.kestra.plugin.scripts.powershell.Script](/plugins/plugin-script-powershell/io.kestra.plugin.scripts.powershell.script)
- [io.kestra.plugin.scripts.go.Script](/plugins/plugin-script-go/io.kestra.plugin.scripts.go.script)
- [io.kestra.plugin.scripts.go.Commands](/plugins/plugin-script-go/io.kestra.plugin.scripts.go.commands)
- [io.kestra.plugin.scripts.deno.Script](/plugins/plugin-script-deno/io.kestra.plugin.scripts.deno.script)
- [io.kestra.plugin.scripts.deno.Commands](/plugins/plugin-script-deno/io.kestra.plugin.scripts.deno.commands)
- [io.kestra.plugin.scripts.bun.Script](/plugins/plugin-script-bun/io.kestra.plugin.scripts.bun.script)
- [io.kestra.plugin.scripts.bun.Commands](/plugins/plugin-script-bun/io.kestra.plugin.scripts.bun.commands)
- [io.kestra.plugin.scripts.php.Script](/plugins/plugin-script-php/io.kestra.plugin.scripts.php.script)
- [io.kestra.plugin.scripts.php.Commands](/plugins/plugin-script-php/io.kestra.plugin.scripts.php.commands)
- [io.kestra.plugin.scripts.perl.Script](/plugins/plugin-script-perl/io.kestra.plugin.scripts.perl.script)
- [io.kestra.plugin.scripts.perl.Commands](/plugins/plugin-script-perl/io.kestra.plugin.scripts.perl.commands)
- [io.kestra.plugin.scripts.groovy.Script](/plugins/plugin-script-groovy/io.kestra.plugin.scripts.groovy.script)
- [io.kestra.plugin.scripts.groovy.Commands](/plugins/plugin-script-groovy/io.kestra.plugin.scripts.groovy.commands)

Check available [blueprints](/blueprints) to get started.

## When to use `Script` over `Commands`?

**Advantages of Script:**
- **Simplicity:** script code is stored and **versioned** with the flow’s revision history alongside orchestration logic.
- **Easy templating:** when the workflow is defined in a single file, it’s straightforward to access inputs, variables, and pass outputs to downstream tasks.

**Disadvantages of Script (vs. Commands):**
- **Readability:** long inline scripts are harder to read and test than code in separate files (which also benefit from the embedded code editor).
- **Complex use cases:** for multi-file projects or shared modules, use **Commands** instead.

**Recommendation:** use **Commands** for advanced production workloads; **Script** is great for simple use cases and quick iteration.

## Examples

Below is the same Python logic implemented with both **Script** and **Commands** tasks.

### Script task

```yaml
id: python_script
namespace: company.team

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install requests kestra
    script: |
      from kestra import Kestra
      import requests

      response = requests.get('https://kestra.io')
      print(response.status_code)

      Kestra.outputs({'status': response.status_code, 'text': response.text})
```

### Commands task

```yaml
id: python_commands
namespace: company.team

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      include:
        - main.py
    beforeCommands:
      - pip install requests kestra
    commands:
      - python main.py
```

`main.py`:

```python
from kestra import Kestra
import requests

response = requests.get('https://kestra.io')
print(response.status_code)

Kestra.outputs({'status': response.status_code, 'text': response.text})
```

## Pass values into code

You can pass values into your code using expressions. Below, the expression is used directly inside a **Script** task:

```yaml
id: python_script_dynamic
namespace: company.team

inputs:
  - id: uri
    type: STRING
    defaults: https://kestra.io

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Script
    beforeCommands:
      - pip install requests kestra
    script: |
      from kestra import Kestra
      import requests

      response = requests.get('{{ inputs.uri }}')
      print(response.status_code)

      Kestra.outputs({'status': response.status_code, 'text': response.text})
```

To pass values into **Commands** tasks, use environment variables:

```yaml
id: python_commands_dynamic
namespace: company.team

inputs:
  - id: uri
    type: STRING
    defaults: https://kestra.io

tasks:
  - id: python
    type: io.kestra.plugin.scripts.python.Commands
    namespaceFiles:
      enabled: true
      include:
        - main.py
    beforeCommands:
      - pip install requests kestra
    commands:
      - python main.py
    env:
      URI: "{{ inputs.uri }}"
```

`main.py`:

```python
from kestra import Kestra
import requests
import os

response = requests.get(os.environ['URI'])
print(response.status_code)

Kestra.outputs({'status': response.status_code, 'text': response.text})
```
