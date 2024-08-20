---
title: Rust
icon: /docs/icons/rust.svg
---

Run Rust code inside of your flow.

You can execute arbitrary Rust code in a Docker container using the `Shell` plugin. You can set a container image including the required package dependencies for your Rust application.

In this example, we're using the Docker Task Runner with the `rust:latest` image so that Rust code can be executed.

```yaml file=public/examples/commands_rust.yml
```

The contents of the `main.rs` file contains a simple print statement:

```rust
fn main() {
    println!("Hello World");
}
```

Add your Rust code using the built-in Editor or sync it via CI/CD or [using our Git plugin](../08.developer-guide/04.git.md). You'll also need to set the `namespaceFiles.enabled` flag to `true` to indicate that the task should load namespace files.

You can also add your code inline using the `inputFiles` property.

```yaml file=public/examples/commands_rust_inline.yml

## Handling Outputs

Your Rust code can generate file-based [outputs](../04.workflow-components/06.outputs.md).

In your Rust code, write a file to the local directory. Then, use the `outputFiles` property to point Kestra to the path of those [output files](../08.developer-guide/07.scripts/08.output-directory.md). 

The example below writes an `output.txt` file containing the text "Hello World". To read that output file in another downstream task, you can use the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and if you need a file's content as a string rather than a file path, you can wrap that expression in a `read()` function e.g. `{{ read(outputs.mytask.outputFiles['outputs.txt']) }}`.

```yaml file=public/examples/scripts_output-files-rust.yml
```
