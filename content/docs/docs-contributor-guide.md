---
title: Contribute to Kestra Documentation
icon: /docs/icons/contributing.svg
---

Contribute to the Kestra Documentation.

We love documentation contributions. To contribute to the documentation, make sure to fork the [docs repository](https://github.com/kestra-io/docs/fork) and create a pull request with your changes. We'll happily review and merge your suggestions into the documentation set as quickly as we can.

## Build the Documentation Locally

The following dependencies are required to build Kestra docs locally:
- Node 14+ and npm
- an IDE

To start contributing:
- [Fork](https://github.com/kestra-io/docs/fork) the repository
- Clone the fork on your workstation:

```shell
$ git clone git@github.com:{YOUR_USERNAME}/docs.git
$ cd docs
```


Use the following commands to serve the docs locally:

```shell
# install dependencies
$ npm install

# serve with hot reload at localhost:3001
$ npm run dev

# to generate static pages
$ npm run generate

# making a production build
$ npm run build
```

Aside from contributing to the text, understanding the documentation's general structure, and building the site locally, there are many custom implementations and markdown elements that we use across the documentation set you should become familiar with. Additionally, contributing to the Kestra Plugin documentation requires a basic understanding of their structure and basic Java for doc strings. This page aims to cover all of the components you might come across when contributing to the Kestra Docs.

## Contribute to the Kestra Documentation

### ChildCard

The documentation is structured in multiple levels where the top level is an index page such as "Getting Started", "Workflow Components", and "Cloud & Enterprise Edition". This acts as a landing page for all of the content that falls under those high level categories. To serve a visitor everything within that topic, we use a `ChildCard` component on the index page. This component is built from the `ChildCard.vue` file within `components.content`.

The index file's markdown looks like this:

```markdown
---
title: Getting Started
---

Follow the [Quickstart Guide](./01.quickstart.md) to install Kestra and start building your first workflows.

::ChildCard
::
```

And the page displays the following with all the sub topics of Getting Started listed with their card and icon:

![Getting Started ChildCard](/docs/docs-contributor-guide/child-card.png)

Important to note when writing a standalone documentation page, the first sentence appears in the ChildCard view to introduce the topic. In the above example for [Quickstart Guide](01.getting-started/01.quickstart.md) it is:

```markdown
Start Kestra in a Docker container and create your first flow.
```

It is ideal to keep this first sentence as clear and concise as possible to not clutter the view on the card.

### Front Matter

There are several key front matter properties that are expected with each page in the documentation. We briefly mentioned one of them, icon, in the last section. As an example, take our [Apps](./06.enterprise/04.scalability/apps.md) page. This is the front matter specified on the markdown page:

```markdown
---
title: Apps
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
version: ">= 0.20.0"
docId: apps
---
```

And this is the resulting view:

![Apps Front Matter](/docs/docs-contributor-guide/apps-frontmatter.png)

Let's discuss each property in more detail.

#### title

This is simply the title of the page, but it is important to make sure this is clear. Typically this will just be the name of the feature or the concept, but as a contributor you may want to write your own ["How to guide"](15.how-to-guides/) with your Kestra use case. In this scenario, be clear about the purpose of the guide and with what feature or Plugin (e.g., [Access Files on your Local Machine in Kestra ](15.how-to-guides/access-local-files.md)).

#### icon

Icons are SVG files that are used to identify a certain tool being used or general concept. They appear at the top of all documentation pages and in the ChildCard of the page. For example, this [Neon with Kestra guide](15.how-to-guides/neon.md) has the following properties:

```markdown
---
title: Connect Neon Database to Kestra
icon: /docs/icons/neon.svg
stage: Intermediate
topics:
  - Integrations
---
```

And appears on the site like so:

![Neon Icon Display](/docs/docs-contributor-guide/neon-icon.png)

The icon lives in the `public/docs/icons` folder path and is specified as [Neon](https://neon.tech/home) so the correct logo shows for the tool. There are also general icons available in the folder such as `api.svg` or `installation.svg`. If you contribute a guide incorporating a tool without an existing icon, place the appropriate SVG file in this folder and reference it in the front matter.

#### topics & stage

Our How To Guides require a couple of extra front matter properties to provide clarity to the site visitor what the topic of the guide is and the level; these being `topics` and `stage`. Using the same examle as above, you can see that the properties are set as `stage: Intermediate` and `topics: - Integrations`.

```markdown
---
title: Connect Neon Database to Kestra
icon: /docs/icons/neon.svg
stage: Intermediate
topics:
  - Integrations
---
```

These properties are `const` variables set in the `GuidesChildCard.vue` file of the repository. They have a set list to choose from when classifying a guide. For example, `stage` can be "Getting Started", "Intermediate", or "Advanced". `topics` can be a multitude of different concepts such as "Scripting", "Kestra Concepts", "Best Practices", and more. If your guide doesn't fit into any of these topics, add it there, and we can review it.

#### editions

Kestra has three editions: Open Source, Enterprise, and Cloud. A feature or guide may be relevant only to one, two, or all editions, so we have a front matter property to specify that right away at the top of a page. For example, depending on the Kestra edition, there are different pages relevant to handling secrets. We have a [Kubernetes Secrets How-to Guide](15.how-to-guides/kubernetes-secrets.md) where we set the edition as OSS in the front matter:

```markdown
---
title: Set Up Secrets from a Helm Chart
icon: /docs/icons/helm.svg
stage: Getting Started
topics:
  - Kestra Concepts
  - DevOps
editions: ["OSS"]
---
```

And we have a page for [Secrets](06.enterprise/02.governance/secrets.md) that is specifically for Enterprise and Cloud users.

```markdown
---
title: Secrets
icon: /docs/icons/admin.svg
editions: ["EE", "Cloud"]
docId: secrets
---
```

#### version

Like editions, some Kestra features are only available in specific Kestra versions and onwards. To identify this in the documentation, we use the `version` property in the front matter. For example, [Worker Groups](06.enterprise/04.scalability/worker-group.md) are only available starting in Kestra version 0.10.0. This is specified as follows:

```markdown
---
title: Worker Group
icon: /docs/icons/admin.svg
editions: ["EE"]
version: ">= 0.10.0"
---
```

#### docId

One of the major benefits to Kestra is its in-app contextual docs. This means, when constructing flows in the platform, you can access the documentation in the same interface without having to navigate to the browser to check against our documentation. This is done through the `docId` front matter.
Kestra knows that you are working with Apps, and it can show you the relevant documentation without a task switch.

![In-App Docs](/docs/docs-contributor-guide/in-app-docs.gif)

The same is done for all the main components of Kestra (e.g., Namespace, Flow, Blueprints, Plugins, etc.).

#### release

`release` is a front matter property only relevant for our [Migration Guides](11.migration-guide/index.md). These guides outline the need-to-know information for upgrading from one version of Kestra to another. This includes the renaming of a feature or "Before and After" examples of an action in Kestra. Example configuration looks like this:

```markdown
---
title: Restarting parent flow
icon: /docs/icons/migration-guide.svg
release: 0.21.0
editions: ["OSS", "EE"]
---
```

### Customized text

We use a couple of components to add customized text presentation in the documentation. To differentiate important information from average text, we use three different levels of alert types: "info", "success", and "warning".

::alert{type="info"}
This is something to make note of.
::

::alert{type="success"}
Yippee, it worked.
::

::alert{type="warning"}
This is a warning, but it's fine.

![this is fine](/docs/docs-contributor-guide/this-is-fine.png)
::

Another useful component we use is `::collapse`. This tag is used to keep the documentation space-efficient and to hide long examples or other information that does not need to be seen immediately scrolling the page, but it can be opened up by the reader to reveal its content. This is particularly useful for example flows that could otherwise take up a lot of space on a page or FAQ Answers that may not be relevant to every reader and can be selected as needed.

Use the following syntax with whatever should be collapsed within the colons and the title inline with `::collapse`:

```markdown
::collapse{title="Introduction to whatever is collapsed"}

Here is where the collapsed text goes.

::
```
Here is a full example using an example flow:

::collapse{title="Full Example"}

Subflow:

```yaml
id: subflow
namespace: company.team

inputs:
  - id: items
    type: STRING

tasks:
  - id: for_each_item
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner:
      type: io.kestra.plugin.core.runner.Process
    commands:
      - cat "{{ inputs.items }}"

  - id: read
    type: io.kestra.plugin.core.log.Log
    message: "{{ read(inputs.items) }}"
```

Below is a Flow that uses the `ForEachItem` task to iterate over a list of items and run the `subflow` for a batch of 10 items at a time:

```yaml
id: each_parent
namespace: company.team

tasks:
  - id: extract
    type: io.kestra.plugin.jdbc.duckdb.Query
    sql: |
      INSTALL httpfs;
      LOAD httpfs;
      SELECT *
      FROM read_csv_auto('https://huggingface.co/datasets/kestra/datasets/raw/main/csv/orders.csv', header=True);
    store: true

  - id: each
    type: io.kestra.plugin.core.flow.ForEachItem
    items: "{{ outputs.extract.uri }}"
    batch:
      rows: 10
    namespace: company.team
    flowId: subflow
    wait: true
    transmitFailed: true
    inputs:
      items: "{{ taskrun.items }}"
```
::

While a feature may be available after a certain Kestra version and indicated in the front matter, an additional function may be added to it in later versions that doesn't match the front matter. To indicate this in the documentation for only a certain section of a page, we use the `::badge` component. This component can be used at any point in the page rather than solely at the top.

The component has the following syntax, able to include both `version` and `editions` like the Front Matter:

```markdown
::badge{version=">=0.15" editions="OSS,EE,Cloud"}
```

::badge{version=">=0.15" editions="OSS,EE,Cloud"}
::

### Video Container

In the documentation, we try to always have an accompanying video for the discussed feature. To make sure the Youtube video is embedded and displaying correctly and consistently on every page, we use a custom `video-container` div class. On each page the div is added with the following embedding after the page's introductory sentence and before the rest of the content. 

```
<div class="video-container">
  <iframe src="https://www.youtube.com/embed/97xvcAMf888?si=y9vEEtGvoHfLxsK4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
```

The `video-container` is maintained in the `docs.scss` file in the repository. Check out the [Contributing Guide](01.getting-started/03.contributing.md) to see a page with a video embedded.

### Code Blocks

When including code blocks in the documentation, make sure to specify which language the example is written in. Typically in the Kestra documentation, example flows are included to demonstrate a feature; they are specified as a `yaml` code block. For example, see the following flow in markdown:

<pre>
```yaml
id: getting_started
namespace: company.team
tasks:
  - id: hello_world
    type: io.kestra.plugin.core.log.Log
    message: Hello World!
```
</pre>

The supported languages for code blocks are fully listed in the `useShiki.ts` file in the repository, and if you need something new added, that is where an addition can be made.

### How to Use Images

Images are a core part documentation. We try to organize images by topic and section in the documentation so that they are easy to find and add to. Taking this guide as an example, an image we used earlier in the guide appears in the markdown as follows:

```markdown
![Apps Front Matter](/docs/docs-contributor-guide/apps-frontmatter.png)
```

The image has a clear title, and it is located in an image folder called `docs-contributor-guide` in the `public/docs` directory of the repository. For this guide, all images are placed in this folder path so the organization is clear and easily worked with by another contributor. This same practice is used for our blog and other parts of the website kept in the repository.

## Contribute to Kestra Plugin Documentation

Kestra Plugins each have their own documentation page found on the website in [Plugins](/plugins). Each plugin also has in-app contextual documentation so that task and property definitions are easily usable while building flows. Plugin docs are maintained in their own separate repositories rather than the product documentation.

For example, if you are looking to contribute to the [OpenAI Plugin](/plugins/plugin-openai), you can find the documentation in the [OpenAI Plugin Repository](https://github.com/kestra-io/plugin-openai).

::alert{type="info"}
All plugin repos are searchable from the main [Kestra GitHub](https://github.com/kestra-io). The name of the repository is in the URL of the plugin documentation page. For example, the OpenAI repo is called `plugin-openai` which is in the URL path `https://kestra.io/plugins/plugin-openai/io.kestra.plugin.openai.chatcompletion`. Simply searching the tool's name should suffice, but this always works just in case.
::

To contribute to a plugin's documentation, clone the repository. Once cloned, there are four key components to plugin task's documentation that contributions are more than welcome: title, description, examples, and properties. 

Continuing with [OpenAI](/plugins/plugin-openai), the tasks include [ChatCompletion](/plugins/plugin-openai/io.kestra.plugin.openai.chatcompletion) and [CreateImage](/plugins/plugin-openai/io.kestra.plugin.openai.createimage).

![OpenAI Plugin Tasks](/docs/docs-contributor-guide/open-ai-plugin-tasks.png)

Each task can be located in the path `src/main/java/io/kestra/plugin/openai`. This will be similar for all other plugins (i.e., `src/main/java/io/kestra/plugin/<insert-plugin-name>`). To improve or add to the documentation, open the Java file of the task and look for the `@Schema`, `@Plugin`, and `@Example` doc strings.

::alert{type="info"}
You do not need to be well-versed in Java to contribute to the plugin documentation. The doc strings are organized so that they are easy to work with, and we will review any contributions anyways so have no fear.
::

The plugin documentation will generally look like the following:

```java
@Schema(
    title = "Given a prompt, get a response from an LLM using the OpenAI’s Chat Completions API.",
    description = "For more information, refer to the [Chat Completions API docs](https://platform.openai.com/docs/guides/gpt/chat-completions-api)."
)
@Plugin(
    examples = {
        @Example(
            full = true,
            title = "Based on a prompt input, generate a completion response and pass it to a downstream task.",
            code = """
                id: openai
                namespace: company.team

                inputs:
                  - id: prompt
                    type: STRING
                    defaults: What is data orchestration?

                tasks:
                  - id: completion
                    type: io.kestra.plugin.openai.ChatCompletion
                    apiKey: "yourOpenAIapiKey"
                    model: gpt-4o
                    prompt: "{{ inputs.prompt }}"

                  - id: response
                    type: io.kestra.plugin.core.debug.Return
                    format: {{ outputs.completion.choices[0].message.content }}"
                """
        ),
```

The key properties to consider are:
- `title`: A concise single sentence describing the task's objective that is displayed in the Kestra in-app contextual docs.
- `description`: Additional information such as links to the external tool's documentation or best practices for using the task.
- `examples`: Flow examples that demonstrate the task in use. Best if it is a logical use case utilizing multiple Kestra features (e.g., [Triggers](04.workflow-components/07.triggers/index.md), [Inputs](04.workflow-components/05.inputs.md), [Outputs](04.workflow-components/06.outputs.md), etc).

Similarly to the main plugin attributes, the properties are also documented with a `title` and a `description`. For example, the [OpenAI ChatCompletion properties](https://kestra.io/plugins/plugin-openai/io.kestra.plugin.openai.chatcompletion#properties-body):

```java
public class ChatCompletion extends AbstractTask implements RunnableTask<ChatCompletion.Output> {
    @Schema(
        title = "A list of messages comprising the conversation so far.",
        description = "Required if prompt is not set."
    )
    private Property<List<ChatMessage>> messages;

    @Schema(
        title = "The function call(s) the API can use when generating completions."
    )
    private Property<List<PluginChatFunction>> functions;

    @Schema(
        title = "The name of the function OpenAI should generate a call for.",
        description = "Enter a specific function name, or 'auto' to let the model decide. The default is auto."
    )
    private Property<String> functionCall;

    @Schema(
        title = "The prompt(s) to generate completions for. By default, this prompt will be sent as a `user` role.",
        description = "If not provided, make sure to set the `messages` property."
    )
```

If any titles, descriptions, or examples could be improved or added, create a pull request or an issue on the specific plugin repo, and we will happily review and merge it into the set.

## Contribute to Kestra Blueprints

The official Kestra Blueprints library can be found under [kestra.io/blueprints](/blueprints).
Blueprints are a curated, organized, and searchable catalog of ready-to-use examples designed to help you kickstart your workflow.
Each Blueprint combines code and documentation and can be assigned several tags for organization and discoverability.

To contribute a blueprint or modify an existing one, clone the [Blueprints repository](https://github.com/kestra-io/blueprints). Within the repository, there are blueprints for [Apps](https://github.com/kestra-io/blueprints/tree/main/apps), [Dashboards](https://github.com/kestra-io/blueprints/tree/main/dashboards), and [Flows](https://github.com/kestra-io/blueprints/tree/main/flows).

All Blueprints are `yaml` files composed of the example Flow, App, or Dashboard, and an `extend` property that specifies attributes such as `title` and `description` to propagate onto the website. For example, this [Getting Started with Kestra – a Data Engineering Pipeline](https://kestra.io/blueprints/data-engineering-pipeline) has the following `extend` property:

```yaml
extend:
  title: Getting started with Kestra — a Data Engineering Pipeline example
  description: |
    This flow is a simple example of a Kestra flow used for a data engineering
    use case. It downloads a JSON file, filters the data, and calculates the
    average price per brand.

    The flow has three tasks:
    1. The first task downloads a JSON file.
    2. The second task filters the data and writes it to a new JSON file.
    3. The third task reads the filtered data, calculates the average price per
    brand using DuckDB, and stores the result as a Kestra output which can be
    previewed and downloaded from the UI.
  tags:
    - Getting Started
    - API
    - Python
    - SQL
  ee: false
  demo: true
  meta_description: This flow represents a data engineering use case. It downloads
    a JSON file, filters the data in Python, and calculates the KPIs in SQL
    using DuckDB.
```

Check out the [full file](https://github.com/kestra-io/blueprints/blob/main/flows/data-engineering-pipeline.yaml) to see the flow YAML. 

It is important to include the appropriate `tags` for the blueprint, so that it is easily searchable. A full list of tags is available on the [Blueprints homepage](/blueprints).

With the proper YAML and extension, the Flow's topology will display interactively on the blueprint page along with a **Copy source code** button and task icons.

![Blueprint Page](/docs/docs-contributor-guide/blueprint-page.png)

If you have any ideas for new blueprints, or any existing titles, descriptions, or examples could be improved, create a pull request or an issue on the Blueprints repo. We will happily review and merge it into the set.
