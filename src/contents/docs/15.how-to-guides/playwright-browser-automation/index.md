---
title: Run Playwright Browser Automation in Kestra
h1: Run Headless Browser Checks with Playwright in Kestra
description: Run Playwright browser automation from a Kestra workflow using Node.js and the Docker Task Runner. Capture screenshots and fail executions when page checks do not pass.
icon: /src/contents/docs/icons/nodejs.svg
stage: Intermediate
topics:
  - Scripting
  - DevOps
---

Run a Playwright browser check from a Kestra flow, capture a screenshot, and fail the execution when the page doesn't meet your expectations.

An HTTP check tells you whether a server responds. A browser check also lets you inspect the rendered page. This flow opens a URL in Chromium, checks the HTTP status and expected text, and writes a screenshot and a JSON result.

## Prerequisites

- A Kestra instance with the [Node.js Script task](/plugins/plugin-script-node/io.kestra.plugin.scripts.node.script) available.
- A worker configured to use the [Docker Task Runner](../../task-runners/04.types/02.docker-task-runner/index.md).
- Network access from the worker to pull the Playwright image, and from the task container to install the npm package and reach your target site.
- A trusted site or test environment that you're allowed to test.

## Create and run the flow

1. Create a flow in the Kestra UI.
2. Paste the following YAML into the Flow editor.
3. Save the flow.
4. Execute it with the default inputs, or set `url` and `expected_text` for your own site.

The complete flow installs Playwright and runs the check in its matching browser image:

```yaml
id: playwright_browser_check
namespace: company.team

description: Run a browser-based page check with Playwright.

inputs:
  - id: url
    type: URI
    defaults: https://kestra.io

  - id: expected_text
    type: STRING
    defaults: Open Source

tasks:
  - id: browser_check
    type: io.kestra.plugin.scripts.node.Script

    containerImage: mcr.microsoft.com/playwright:v1.63.0-noble

    taskRunner:
      type: io.kestra.plugin.scripts.runner.docker.Docker
      shmSize: "1073741824"

    beforeCommands:
      - npm install playwright@1.63.0

    env:
      TARGET_URL: "{{ inputs.url }}"
      EXPECTED_TEXT: "{{ inputs.expected_text }}"

    outputFiles:
      - screenshot.png
      - result.json

    script: |
      const { chromium } = require("playwright");
      const fs = require("fs");
      const path = require("path");

      (async () => {
        const browser = await chromium.launch({
          headless: true
        });

        try {
          const page = await browser.newPage({
            viewport: {
              width: 1440,
              height: 900
            }
          });

          const response = await page.goto(process.env.TARGET_URL, {
            waitUntil: "domcontentloaded",
            timeout: 30000
          });

          if (!response) {
            throw new Error("The page did not return an HTTP response.");
          }

          const status = response.status();
          const title = await page.title();
          const bodyText = await page.locator("body").innerText();
          const expectedTextFound = bodyText.includes(
            process.env.EXPECTED_TEXT
          );

          await page.screenshot({
            path: path.join(process.env.WORKING_DIR, "screenshot.png"),
            fullPage: true
          });

          const result = {
            url: process.env.TARGET_URL,
            status,
            title,
            expectedText: process.env.EXPECTED_TEXT,
            expectedTextFound
          };

          fs.writeFileSync(
            path.join(process.env.WORKING_DIR, "result.json"),
            JSON.stringify(result, null, 2)
          );

          console.log(JSON.stringify(result));

          if (status >= 400) {
            throw new Error(`Page returned HTTP ${status}.`);
          }

          if (!expectedTextFound) {
            throw new Error(
              `Expected text "${process.env.EXPECTED_TEXT}" was not found.`
            );
          }
        } finally {
          await browser.close();
        }
      })().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
```

### Container configuration

The [Playwright Docker image](https://playwright.dev/docs/docker) includes browser binaries and their Linux dependencies. It doesn't include the Playwright npm package, so `beforeCommands` installs it. Keep the package and image versions matched when updating the flow.

Chromium uses shared memory inside the container. `shmSize: "1073741824"` gives `/dev/shm` 1 GiB, which helps avoid browser crashes caused by insufficient shared memory.

### Page checks

The `url` and `expected_text` inputs let you reuse the flow for different pages without editing the script. Their values reach Node.js through environment variables.

`page.goto()` waits for `domcontentloaded`, with a 30-second navigation timeout. `page.locator("body").innerText()` reads the rendered body text at that point, and `includes()` checks for a case-sensitive substring. This doesn't wait for text loaded by later API calls; for those pages, add a locator wait for the specific element you need.

The script writes its files before checking for HTTP status codes of 400 or higher and missing text. Either condition throws an error. The catch handler logs the error and sets a nonzero exit code, so Kestra marks the task and execution as failed. The browser closes in `finally`.

## Check the outputs

1. Open the completed execution.
2. Check the task status and the **Logs** tab.
3. Open the **Outputs** tab and select `browser_check`.
4. Preview or download `screenshot.png` and `result.json` under `outputFiles`.

The script writes both files to `WORKING_DIR`, and the task's `outputFiles` property tells Kestra which files to capture in Internal Storage. The JSON printed with `console.log()` is a log entry; it doesn't create a separate structured variable output.

A successful run against `https://kestra.io` returned this result. Your result can change as the site changes:

```json
{
  "url": "https://kestra.io",
  "status": 200,
  "title": "Kestra, Open Source Declarative Orchestration Platform",
  "expectedText": "Open Source",
  "expectedTextFound": true
}
```

You can reference the captured JSON file from another task with `{{ outputs.browser_check.outputFiles['result.json'] }}`. See [script output files](../../16.scripts/06.outputs-metrics/index.md) for more details.

Run the flow again with `expected_text` set to a string that isn't on the page. The execution should fail and the logs should identify the missing text. The screenshot and JSON result remain available for missing-text and HTTP-status failures because the script writes them before throwing. Browser startup or navigation failures can occur before the files are written, so those failures may have no screenshot or JSON result.

## Validate a specific element

For a page with a button named **Get Started**, add this snippet inside the `try` block after navigation. It's an extension example; it doesn't assume that `kestra.io` has this button:

```javascript
const button = page.getByRole("button", {
  name: "Get Started",
  exact: true
});

await button.waitFor({
  state: "visible",
  timeout: 10000
});
```

This waits up to ten seconds for the button to become visible and throws if it doesn't. Replace the role and accessible name with those of the element on your page.

## Schedule the check

Add this optional fragment at the root of the flow, alongside `tasks`, to run the check every 30 minutes:

```yaml
triggers:
  - id: every_30_minutes
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "*/30 * * * *"
```

The [Schedule trigger](../../05.workflow-components/07.triggers/01.schedule-trigger/index.md) uses the input defaults for these executions. This gives you a basic synthetic monitor with an execution history and page artifacts; alerts and broader monitoring require additional configuration.

:::alert{type="warning"}
Use this example only with trusted sites or test environments. The Playwright image runs as root by default, which disables Chromium's sandbox. Don't use this unrestricted container to browse arbitrary untrusted websites.
:::
