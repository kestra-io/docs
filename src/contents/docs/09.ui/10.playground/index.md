---
title: "Playground in Kestra UI: Build Flows Task by Task"
h1: Experiment and Debug Workflows with Kestra Playground
description: Experiment in the Kestra Playground. Build and test tasks iteratively in the UI to debug and refine workflows without full execution.
sidebarTitle: Playground
icon: /src/contents/docs/icons/ui.svg
editions: ["OSS", "EE"]
---

Iteratively build and test flows task by task without running the entire workflow.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/p7UXd66GI1M?si=1Dzc6cjghO8BGAhh" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

**Playground mode** lets you build workflows iteratively, one task at a time. This feature is especially useful when building data processing flows, where you typically start with a task extracting data, and you need to inspect the output before knowing what kind of transformation might be required. Then, you can work on that transformation task without rerunning the extraction task.

If you've ever worked with a [Jupyter](https://jupyter.org/) notebook, you might be familiar with this pattern: you run the first cell to extract data, then you run the second cell to transform that data, and you can rerun the second cell multiple times to test different transformations without having to rerun the first cell again. Kestra's Playground mode allows you to do the same within your flows.

## Use Playground mode

To use Playground mode:

1. Enable the Playground mode.
2. Add a task to your flow and hit **Play** to run it.
3. Add a second task and hit **Play** to run it, reusing the output of the first task.
4. Modify the second task and hit **Play** again to rerun only the second task.
5. Add a third task and hit **Play** to run it, reusing the outputs of the first and second tasks.
6. Keep iterating by adding more tasks and running them individually, or click on **Run all tasks** or **Run all downstream tasks** options to run multiple tasks at once.

Kestra tracks up to 10 recent playground runs, so you can go back to inspect the outputs of previously executed tasks. Older runs are purged automatically. Playground runs won't appear in the regular execution list to avoid confusion with production executions.

Playground mode requires a DAG (Directed Acyclic Graph) structure, so you cannot run a task before its upstream tasks have been played. If you change flow-level `inputs`, `variables`, or `outputs` properties while in Playground mode, existing task runs are automatically reset and must be rerun. Kestra resets them to ensure that task outputs remain consistent with the flow-level properties.

To see Playground in action, check out the demo below.

<div style="position: relative; padding-bottom: calc(54.828% + 41px); height: 0px; width: 100%;"><iframe src="https://demo.arcade.software/6ndSRG2Yeak23aKuwosz?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true" title="playground_data_pipeline | Kestra EE" frameborder="0" loading="lazy" webkitallowfullscreen mozallowfullscreen allowfullscreen allow="clipboard-write; autoplay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; color-scheme: light;" ></iframe></div>

```yaml
id: playground_data_pipeline
namespace: company.team
description: |
  A step-by-step data pipeline designed for the Playground feature.
  Run each task individually to inspect outputs before proceeding to the next stage.
labels:
  team: engineering
  type: demo

tasks:
  - id: fetch_products
    type: io.kestra.plugin.core.http.Request
    uri: https://jsonplaceholder.typicode.com/todos?_limit=10
    method: GET

  - id: extract_titles
    type: io.kestra.plugin.core.debug.Return
    format: "{{ outputs.fetch_products.body | jq('map(select(.completed == false)) | map(.title)') }}"

  - id: count_pending
    type: io.kestra.plugin.core.debug.Return
    format: "{{ outputs.fetch_products.body | jq('[.[] | select(.completed == false)] | length') }}"

  - id: build_report
    type: io.kestra.plugin.core.debug.Return
    format: "Pending tasks: {{ outputs.count_pending.value }} | First item: {{ outputs.extract_titles.value | jq('.[0]') }}"
```
