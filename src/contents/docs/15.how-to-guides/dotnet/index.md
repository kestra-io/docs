---
title: Run C# Inside Your Flows
h1: Execute C# Scripts in Kestra Workflows
description: Run C# scripts in Kestra using dotnet-script. Automate .NET workflows, reference NuGet packages inline, and capture outputs for downstream tasks.
icon: /src/contents/docs/icons/dev.svg
stage: Getting Started
topics:
  - Scripting
---

Run C# code directly in your flows using [dotnet-script](https://github.com/dotnet-script/dotnet-script). Write inline `.csx` scripts with NuGet package references, or run arbitrary `dotnet` CLI commands inside a .NET SDK container.

## Scripts

Use `io.kestra.plugin.scripts.dotnet.Script` to write C# code inline in your flow. The script is written to a temporary `.csx` file and executed with `dotnet-script`, which is installed automatically before each run.

```yaml
id: dotnet_script
namespace: company.team

tasks:
  - id: hello_csharp
    type: io.kestra.plugin.scripts.dotnet.Script
    script: |
      Console.WriteLine("Hello from Kestra and C#");
```

### NuGet package references

Reference NuGet packages inline with `#r "nuget:PackageName,Version"` directives at the top of your script. The first run with a new package triggers a NuGet restore that may take 30–60 seconds; subsequent runs use the cached result.

```yaml
id: dotnet_script_nuget
namespace: company.team

tasks:
  - id: parse_json
    type: io.kestra.plugin.scripts.dotnet.Script
    script: |
      #r "nuget:Newtonsoft.Json,13.0.3"
      using Newtonsoft.Json;

      var data = new { message = "Hello from Kestra", timestamp = DateTime.UtcNow };
      Console.WriteLine(JsonConvert.SerializeObject(data));
```

For the full property list, see the [Script plugin documentation](/plugins/plugin-script-dotnet/io.kestra.plugin.scripts.dotnet.script).

## Commands

Use `io.kestra.plugin.scripts.dotnet.Commands` when your C# code lives in namespace files or when you need direct `dotnet` CLI access.

`dotnet-script` is not pre-installed in the default image. Add it to `beforeCommands` when running `.csx` files:

```yaml
id: dotnet_commands
namespace: company.team

tasks:
  - id: run_script_file
    type: io.kestra.plugin.scripts.dotnet.Commands
    namespaceFiles:
      enabled: true
    beforeCommands:
      - dotnet tool install -g dotnet-script --ignore-failed-sources || true
      - export PATH="$PATH:$HOME/.dotnet/tools"
    commands:
      - dotnet-script main.csx
```

Add `main.csx` to your namespace using the Editor or by [syncing from Git](../../version-control-cicd/04.git/index.md). The file can contain:

```csharp
Console.WriteLine("Hello from Kestra");
```

You can also pass a script inline using `inputFiles`:

```yaml
id: dotnet_commands_inline
namespace: company.team

tasks:
  - id: run_inline
    type: io.kestra.plugin.scripts.dotnet.Commands
    inputFiles:
      main.csx: |
        Console.WriteLine("Hello from Kestra");
    beforeCommands:
      - dotnet tool install -g dotnet-script --ignore-failed-sources || true
      - export PATH="$PATH:$HOME/.dotnet/tools"
    commands:
      - dotnet-script main.csx
```

For the full property list, see the [Commands plugin documentation](/plugins/plugin-script-dotnet/io.kestra.plugin.scripts.dotnet.commands).

## Handling outputs

### Variable output

Emit key-value outputs from your script using the `::{}::` pattern. Kestra captures any line matching this format and makes the values available to downstream tasks.

```yaml
id: dotnet_outputs
namespace: company.team

tasks:
  - id: emit_output
    type: io.kestra.plugin.scripts.dotnet.Script
    script: |
      Console.WriteLine("::{\"outputs\":{\"test\":\"value\",\"int\":2,\"bool\":true,\"float\":3.65}}::");

  - id: use_output
    type: io.kestra.plugin.core.debug.Return
    format: "{{ outputs.emit_output.vars.test }}"
```

All output variables are visible in the **Outputs** tab of the execution.

### File output

Write a file inside your script and declare it in `outputFiles`. Kestra captures the file into internal storage and makes it available for download or use in downstream tasks.

```yaml
id: dotnet_output_file
namespace: company.team

tasks:
  - id: write_file
    type: io.kestra.plugin.scripts.dotnet.Script
    outputFiles:
      - output.txt
    script: |
      File.WriteAllText("output.txt", "Hello from C#");

  - id: log_file
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(outputs.write_file.outputFiles['output.txt']) }}"
```

## Handling metrics

Emit metrics using the same `::{}::` pattern as outputs. Kestra supports `counter` and `timer` metric types.

```yaml
id: dotnet_metrics
namespace: company.team

tasks:
  - id: emit_metrics
    type: io.kestra.plugin.scripts.dotnet.Script
    script: |
      Console.WriteLine("::{\"metrics\":[{\"name\":\"recordCount\",\"type\":\"counter\",\"value\":100}]}::");
      Console.WriteLine("::{\"metrics\":[{\"name\":\"processingTime\",\"type\":\"timer\",\"value\":1.23}]}::");
```

Metrics appear under the **Metrics** tab of the execution after it completes.
