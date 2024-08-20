---
title: Rust
icon: /docs/icons/rust.svg
---

Run Rust code inside of your flow.

There isn't an official Rust plugin but we can use the `Shell` `Commands` task to execute arbitrary commands inside of a Docker container. We can also specify a container image that contains the necessary libraries to run the specific programming language. 

In this example, we're using the Docker Task Runner with the `rust:latest` image so that Rust code can be executed.

```yaml file=public/examples/commands_rust.yml
```

The contents of the `main.rs` file contains a simple print statement:

```rust
fn main() {
    println!("Hello World");
}
```

You'll need to add your Rust code using the Editor or [sync it using Git](../08.developer-guide/04.git.md) so Kestra can see it. You'll also need to set the `enabled` flag for the `namespaceFiles` property to `true` so Kestra can access the file.

You can also have the Rust code written inline using the `inputFiles` property.

```yaml file=public/examples/commands_rust_inline.yml
```

You can read more about the Shell Commands type in the [Plugin documentation](/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.commands).

## Handling Outputs

If you want to get a file from your Rust code, you can use an [output](../04.workflow-components/06.outputs.md).

### File Output

Inside of your Rust code, write a file to the system. You'll need to add the `outputFiles` property to your flow and list the files you're trying to put out. In this case, we want to output `output.txt`. More information on the formats you can use for this property can be found [here](../08.developer-guide/07.scripts/08.output-directory.md).

The example below writes a `output.txt` file containing the "Hello World" text. We can then refer the file using the syntax `{{ outputs.{task_id}.outputFiles['<filename>'] }}`, and read the contents of the file using the `read()` function.

```yaml file=public/examples/scripts_output-files-rust.yml
```
