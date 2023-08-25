---
title: Deprecation of core Script tasks
---

Previously, there was scripting tasks inside the core plugin (the plugin that offers core task and is always included inside any Kestra distribution). Since the introduction of the new [Script tasks](https://kestra.io/docs/developer-guide/scripts) in dedicated plugins, the old core scripting tasks have been deprecated and moved out of the core plugin.

If you use one of these tasks, you should migrate to the new one that offers improved scripting capabilities and runs by default in a separate Docker container.

If you still want to use one of the old tasks and you don't use one of our `*-full` Docker images and manually install plugins, you must include the new plugin that now includes the old deprecated tasks.

Here is the list of the old tasks with their new location and the replacement tasks:

- The [Bash](https://kestra.io/plugins/plugin-script-shell/tasks/io.kestra.core.tasks.scripts.bash) task is now located inside the `plugin-script-shell` plugin and replaced by the Shell [Commands](https://kestra.io/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.commands) and [Script](https://kestra.io/plugins/plugin-script-shell/tasks/io.kestra.plugin.scripts.shell.script) tasks.
- The [Node](https://kestra.io/plugins/plugin-script-node/tasks/io.kestra.core.tasks.script.node) task is now located inside the `plugin-script-node` plugin and replaced by the Node [Commands](https://kestra.io/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.commands) and [Script](https://kestra.io/plugins/plugin-script-node/tasks/io.kestra.plugin.scripts.node.script) tasks.
- The [Python](https://kestra.io/plugins/plugin-script-python/tasks/io.kestra.core.tasks.scripts.python) task is now located inside the `plugin-script-python` plugin and replaced by the Python [Commands](https://kestra.io/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.commands) and [Script](https://kestra.io/plugins/plugin-script-python/tasks/io.kestra.plugin.scripts.python.script) tasks.