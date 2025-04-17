---
title: Contribute to Kestra Documentation
icon: /docs/icons/contributing.svg
---

Contribute to the Kestra Documentation.

## Overview

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

We use a couple of components to add customized text presentation in the documentation. To differentiate important information and stand out from average text, we use three different levels of alert types: "info", "success", "error", and "warning".

::alert{type="info"}
This is something to make note of.
::

::alert{type="success"}
Yippee, it worked.
::

::alert{type="error"}
This is a possible error you might see.
::

::alert{type="warning"}
This is fine, fire burning and dog chilling
::

```markdown
::alert
::

::collapse
::

::badge
```


### Video Container

### How to use Images

## Contribute to Kestra Plugin Documentation





