---
title: Contribute to Kestra Documentation
icon: /docs/icons/contributing.svg
---

## Overview

We love documentation contributions. To contribute to the documentation, make sure to fork the [docs repository](https://github.com/kestra-io/docs/fork) and create a pull request with your changes. We'll happily review and get your suggestions in the documentation set as quickly as we can.

For building the site locally check out the [Contributing Guide](./01.getting-started/03.contributing.md#contribute-to-the-documentation) to see the `npm` installation steps.

Aside from contributing to the text, understanding the documentation's general structure, and building the site locally, there are many custom implementations and markdown elements that we use across the documentation set you should become familiar with. Additionally, contributing to the Kestra Plugin documentation requires a basic understanding of their structure and basic Java for doc strings. This page aims to cover all of the components you might come across when contributing to the Kestra Docs.

## Contribute to the Kestra Documentation page

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

### FrontMatter

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

![Apps Frontmatter](/docs/docs-contributor-guide/apps-frontmatter.png)

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

![Neon Icon Display](docs/docs-contributor-guide/neon-icon.png)

The icon lives in the `public/docs/icons` folder path and is specified as [Neon](https://neon.tech/home) so the correct logo shows for the tool. There are also general icons available in the folder such as `api.svg` or `installation.svg`. If contributing a guide incorporating a tool without an existing icon, place the appropriate SVG file in this folder and reference it in the frontmatter.

#### topics & stage


#### editions

#### version

#### release

#### docId

### Customizd text

```markdown
::alert
::

::collapse
::

::div
::
```

### How to use Images

## Contribute to Kestra Plugin Documentation





