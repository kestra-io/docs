---
title: Develop a Plugin UI
sidebarTitle: Develop a Plugin UI
icon: /src/contents/docs/icons/dev.svg
description: Learn how to build custom Vue.js UI components for your Kestra plugin, from scaffolding to Gradle integration, using Module Federation and the artifact-sdk.
---

Plugins can ship custom Vue.js frontend components that load directly into the Kestra UI at runtime, without any changes to Kestra core.

This lets you build domain-specific experiences: visualize a query plan in the topology view, render log output in a structured panel, or display task metadata in a rich card. The core UI stays lean; each plugin brings exactly the UI it needs.

## Why plugin UIs?

Tasks in Kestra produce structured outputs and have rich configuration. But the default topology and log views are generic — they show raw YAML and plain text. When a task is query-centric, graph-centric, or data-heavy, that generic view loses signal.

Plugin UIs let you close this gap without forking Kestra's core. A `topology-details` component can show a formatted query, estimated cost, or job metadata inline in the flow topology. A `log-details` component can structure log output into a readable table. This keeps the core UI generic and lets each plugin deliver the right experience for its domain.

## Architecture

Plugin UIs are built as **Vue.js micro-frontends** using [Module Federation](https://module-federation.io/). The plugin's `ui/` directory compiles to a federated JavaScript module, which is bundled into the plugin JAR under `src/main/resources/plugin-ui/`. At runtime, the Kestra host app discovers and loads these modules dynamically — no static linking required.

```
Plugin JAR
└── src/main/resources/plugin-ui/
    ├── plugin-ui.js       ← the federated module entry point
    ├── manifest.json      ← declares which task types have UI and which slots they fill
    └── *.css              ← scoped styles
```

The `manifest.json` is the contract between the plugin and the host. It tells Kestra which task types expose UI components, which slot each component fills, and any static metadata (dimensions, feature flags) the host needs before loading the component.

The [`@kestra-io/artifact-sdk`](https://github.com/kestra-io/artifact-sdk) handles all the Module Federation configuration, manifest generation, and shared dependencies. You write a Vue component; the SDK takes care of the bundling contract.

## Available UI slots

Each plugin component targets a specific **slot** — a named extension point in the Kestra UI. The SDK defines three slots:

### `topology-details`

Renders in the **execution topology view** when a task node is selected. Receives the task definition and the execution state.

```ts
interface TopologyDetailsProps {
  /** The full task definition object from the flow YAML */
  task: Record<string, unknown>;
  /** The latest execution state for this task, if available */
  execution: Record<string, unknown>;
}
```

The component is shown in the context of a running or completed execution. Check `execution?.id` to detect whether execution data is available and adjust the rendered content accordingly.

### `topology-task-drawer`

Renders in the **flow editor** (low-code editor) drawer when a task node is selected. This slot targets the design-time context, so `execution` may be absent. Receives the same props as `topology-details`.

```ts
interface TopologyTaskDrawerProps {
  /** The full task definition object from the flow YAML */
  task: Record<string, unknown>;
  /** The latest execution state for this task, if available */
  execution: Record<string, unknown>;
}
```

Use this slot to surface design-time information — task configuration previews, schema hints, or query previews — directly in the flow editor drawer.

### `log-details`

Renders in the log view for a task execution attempt. Receives the task definition, the list of log entries, and the attempt number.

```ts
interface LogDetailsProps {
  /** The task definition */
  task: Record<string, unknown>;
  /** Log lines produced by this task attempt */
  logs: LogEntry[];
  /** The attempt number (0-indexed) */
  attemptNumber: number;
}

interface LogEntry {
  level: "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  timestamp: string;
  [key: string]: unknown;
}
```

## Quick start

Use the [`@kestra-io/create-artifact-sdk`](https://github.com/kestra-io/artifact-sdk) scaffolder to bootstrap the `ui/` directory in your plugin. Run this from your plugin's root (the directory containing `settings.gradle` or `settings.gradle.kts`):

```bash
npm create @kestra-io/artifact-sdk
```

The CLI will:

1. **Detect your plugin** — reads `settings.gradle[.kts]` to infer the plugin group ID (e.g. `io.kestra.plugin.example`).
2. **Ask which task** you want to add UI for (e.g. `query.RunQuery`).
3. **Ask which UI slot** to target (`topology-details`, `topology-task-drawer`, or `log-details`).
4. **Ask whether to add `@kestra-io/kestra-sdk`** as a dependency (default: no — add it only if your component needs to call Kestra APIs, see [Calling the Kestra API](#calling-the-kestra-api)).
5. **Show a summary** and ask for confirmation before writing anything.
6. **Scaffold the `ui/` directory** with all required files and run `npm install`.

:::alert{type="info"}
Node.js ≥ 18 is required. The scaffolder can also be run from inside an existing `ui/` directory if you want to add more components later.
:::

## Project structure

After scaffolding, the `ui/` directory looks like this:

```
ui/
├── .gitignore
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── index.html                          ← dev server entry
├── package.json
├── tsconfig.json
├── vite.config.ts                      ← Module Federation config
└── src/
    ├── App.vue                         ← dev server wrapper
    ├── main.ts                         ← dev server entry
    ├── components/
    │   └── QueryRunQueryTopologyDetails.vue   ← your component to edit
    └── QueryRunQueryTopologyDetails.stories.ts
```

The component file is the only file you need to edit. The rest of the scaffolding is boilerplate that wires up the local dev server, Storybook, and the production build.

## Calling the Kestra API

Plugin components often need to fetch data from Kestra — task outputs, execution metrics, flow definitions — to render meaningful information. Use the [`@kestra-io/kestra-sdk`](https://www.npmjs.com/package/@kestra-io/kestra-sdk) package for all API calls instead of raw `fetch()`.

### Why not raw `fetch()`?

Kestra EE uses cookie-based authentication with JWT access tokens and automatic token refresh. Raw `fetch()` bypasses this entirely: it won't include the right credentials in cross-origin contexts, and it won't retry on 401 by refreshing the token. This causes silent failures or authentication errors in production EE deployments.

The SDK wraps every call in an axios instance that the Kestra host configures at startup with `withCredentials: true`, a 401 → token-refresh interceptor, and impersonation support. Any SDK function you call in your component automatically inherits this configuration — no extra setup needed.

### Installation

The scaffolder asks whether to include `@kestra-io/kestra-sdk` during setup. If you answered yes, the package is already in your `package.json`. If you skipped it, add it manually:

```bash
cd ui
npm install @kestra-io/kestra-sdk
```

### Why your plugin doesn't call `configureAxios`

The Kestra host application calls `configureAxios()` once at boot, passing it the auth store, router, and other runtime dependencies. This call registers the EE-aware axios instance globally inside the SDK. Your plugin component only needs to import and call the typed API functions — the auth layer is already wired up by the time your component loads.

```ts
// ✅ correct — import the typed function and call it
import { execution, searchByExecution } from "@kestra-io/kestra-sdk";

// ❌ do not call configureAxios yourself — that's the host's responsibility
// import { configureAxios } from "@kestra-io/kestra-sdk";
// configureAxios(...);
```

### Usage example

The SDK exposes flat async functions, one per API operation. Tenant is injected automatically (the host sets it via `setSelectedTenant` at boot):

```ts
import { ref, watch, computed } from "vue";
import { execution, searchByExecution } from "@kestra-io/kestra-sdk";

// Fetch task outputs from the full execution
const fetchedOutputs = ref<Record<string, any> | null>(null);
const executionId = computed(() => props.execution?.id as string | undefined);

watch(executionId, async (id) => {
  if (!id) return;
  try {
    const exec = await execution({ path: { executionId: id } });
    const tr = exec.taskRunList?.filter((r: any) => r.taskId === props.task.id).at(-1);
    fetchedOutputs.value = (tr as any)?.outputs ?? null;
  } catch { /* best-effort */ }
}, { immediate: true });

// Fetch execution metrics
const metrics = ref<Array<{ name: string; value: number }>>([]);

watch(executionId, async (id) => {
  if (!id) return;
  try {
    const resp = await searchByExecution({ path: { executionId: id } });
    metrics.value = resp.results ?? [];
  } catch { /* best-effort */ }
}, { immediate: true });
```

Key API functions for topology and log components:

| Function | Import | Description |
|---|---|---|
| `flow` | `@kestra-io/kestra-sdk` | Fetch a flow definition (namespace, task config) |
| `execution` | `@kestra-io/kestra-sdk` | Fetch a full execution with task run list |
| `searchByExecution` | `@kestra-io/kestra-sdk/metrics` | Fetch all metrics for an execution |
| `listLogsFromExecution` | `@kestra-io/kestra-sdk/logs` | Fetch log entries for an execution |
| `taskRunOutputs` | `@kestra-io/kestra-sdk/outputs` | Fetch outputs for a specific task run |

:::alert{type="info"}
Wrap every SDK call in `try { … } catch { /* best-effort */ }`. In Storybook and the local dev server (`npm run dev`) there is no Kestra host, so calls will fail — the component should degrade gracefully and fall back to whatever static data the stories or dev harness provides via props.
:::

## Configuring the exposed components

The `vite.config.ts` file declares which components are exposed and under which task types:

```ts
import defaultViteConfig from "@kestra-io/artifact-sdk/vite.config";

export default defaultViteConfig({
  plugin: "io.kestra.plugin.example",

  exposes: {
    "query.RunQuery": [
      {
        slotName: "topology-details",
        path: "./src/components/QueryRunQueryTopologyDetails.vue",
        additionalProperties: {
          height: 120,
          heightWithExecution: 200,
        },
      },
    ],
  },
});
```

- **`plugin`** — the plugin group ID, matching the prefix used in task types.
- **`exposes`** — a map from task type suffix (everything after `io.kestra.plugin.example.`) to a list of slot definitions.
- **`slotName`** — which UI slot this component fills.
- **`path`** — path to the Vue component, relative to `ui/`.
- **`additionalProperties`** — static metadata written to the manifest (see [below](#additional-properties)).

A single task can expose components for multiple slots:

```ts
"query.RunQuery": [
  {
    slotName: "topology-details",
    path: "./src/components/QueryRunQueryTopologyDetails.vue",
    additionalProperties: { height: 120 },
  },
  {
    slotName: "topology-task-drawer",
    path: "./src/components/QueryRunQueryTopologyTaskDrawer.vue",
    additionalProperties: { height: 120 },
  },
  {
    slotName: "log-details",
    path: "./src/components/QueryRunQueryLogDetails.vue",
  },
],
```

## Development workflow

### Local dev server

The scaffolded `src/App.vue` renders your component using the slot's default props. Start the dev server to iterate quickly without running Kestra:

```bash
cd ui
npm run dev
```

### Storybook

Storybook lets you develop and document your component in isolation, with full control over props:

```bash
npm run storybook
```

A starter story is generated alongside the component. Add story variants for pre-execution and post-execution states to cover both rendering modes.

### Building

```bash
npm run build -- --outDir ../src/main/resources/plugin-ui
```

The build output goes directly into the plugin's resource directory, where it will be picked up by the JAR packaging step. See [Gradle integration](#gradle-integration) to automate this.

### Testing in Kestra UI

To see your component running inside a real Kestra instance:

1. Build the UI module:

```bash
cd ui
npm run build -- --outDir ../src/main/resources/plugin-ui
```

2. Package the plugin as a JAR:

```bash
./gradlew shadowJar
```

3. Copy the JAR from `build/libs/` into your local Kestra plugins folder. Make sure there is **only one version** of the plugin JAR in that folder — remove any older versions first to avoid conflicts.

4. Restart both the Kestra backend and frontend.

5. Hard-reload the Kestra UI in your browser to bypass the cache:
   - **Chrome / Firefox**: `Ctrl + Shift + R` (Linux/Windows) or `Cmd + Shift + R` (macOS)
   - **Alternative**: `Ctrl + F5`

:::alert{type="info"}
The browser caches Module Federation bundles aggressively. A hard reload (`Ctrl + Shift + R`) is required after each UI build to ensure the browser fetches the latest version of your component.
:::

## Gradle integration

Add the [Node Gradle plugin](https://github.com/node-gradle/gradle-node-plugin) to your `build.gradle` and wire the UI build into the plugin packaging lifecycle:

```groovy
plugins {
    // ... existing plugins ...
    id 'com.github.node-gradle.node' version '7.1.0'
}

// Build the UI module before packaging (only if ui/ directory exists)
if (file('ui').exists()) {
    tasks.register('npmInstallUI', com.github.gradle.node.npm.task.NpmTask) {
        args = ['install']
        workingDir = file('ui')
    }

    tasks.register('buildUI', com.github.gradle.node.npm.task.NpmTask) {
        dependsOn 'npmInstallUI'
        args = ['run', 'build', '--', '--outDir', '../src/main/resources/plugin-ui']
        workingDir = file('ui')
    }

    processResources.dependsOn 'buildUI'
    shadowJar.dependsOn 'buildUI'
}
```

The `if (file('ui').exists())` guard keeps the build working for other developers and CI pipelines that haven't set up Node.js, without failing the Java build.

Add the build output to `.gitignore` so the compiled assets are not committed:

```
# UI build artifact
src/main/resources/plugin-ui/
```

## Additional properties

The `additionalProperties` object in each slot definition is written verbatim into `manifest.json`. The host app reads this before loading the component, so it can reserve layout space or configure behavior without incurring the cost of loading the full module.

Commonly used properties for `topology-details`:

| Property | Type | Description |
|---|---|---|
| `height` | `number` | Height (in px) of the detail panel before execution |
| `heightWithExecution` | `number` | Height (in px) of the detail panel after execution |
| `customAction` | `object` | Adds a button on the task node that opens a drawer for a specific task property (e.g. a SQL query) |

### `customAction`

The `customAction` property lets the host render an action button directly on the task node in the topology. When clicked, the host opens a drawer displaying the specified task property with syntax highlighting:

```ts
additionalProperties: {
  "customAction": {
    "label": "Show query",   // tooltip and button label
    "taskProp": "sql",       // the task property to display
    "lang": "sql"            // language for syntax highlighting
  }
}
```

This is useful for tasks that carry large or structured payloads (SQL queries, scripts, templates) that are better viewed in a dedicated panel than inline in the YAML editor.

:::alert{type="info"}
`additionalProperties` values are static — they are evaluated at build time and embedded in the manifest. They cannot reference runtime task values.
:::
