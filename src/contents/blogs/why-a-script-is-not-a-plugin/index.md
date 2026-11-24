---
title: "Why a Script Is Not a Plugin"
metaTitle: "Why a Script Is Not a Plugin: Supported Orchestration Plugins vs Scripts"
description: "A script runs once, a plugin is a product. Why Kestra plugins, supported for the full life of each LTS, are worth more than a Python script shipped by an AI in five minutes."
date: 2026-11-26T09:00:00
category: Engineering
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
---

A fair question we hear often: "Your S3 plugin uploads a file. I can do that in ten lines of Python. Why would I pay for that?"

A year ago that was a good question. Today the ten lines take ten seconds, since any coding assistant will write a script that uploads a file to S3, calls a REST API or runs a query on Snowflake. It runs, and it looks fine in the demo.

The code was never the hard part, keeping it working is. A script is a snapshot of what somebody understood on the day they wrote it. A plugin has a maintainer, a test suite, a release process and a support window. This post covers that gap, and why it widens as AI makes scripts cheaper.

<div class="key-takeaways">
<p class="key-takeaways-label">Key takeaways</p>
<ul>
<li>Writing a script is now nearly free. Owning one is not, and the cost lands on you.</li>
<li>A Kestra plugin is maintained, tested, versioned and supported for the full life of each LTS.</li>
<li>A pile of shared scripts is a copy-paste library. A plugin is a typed, validated contract that evolves without breaking your flows.</li>
<li>Kestra runs your scripts too. The skill is knowing which one to use where.</li>
</ul>
</div>

## Scripts Are Cheap, Owning Them Is Not

Nobody argues that scripts are bad. They are the fastest way to get something done, and Kestra runs them well in [Python, Node.js, R, Shell and more](/docs/scripts). The problem starts when a script quietly becomes infrastructure.

Here is what a ten-line upload script does not include:

- Authentication that works with IAM roles, static keys, and assumed roles, not only the one you tested.
- Retries with backoff, and the knowledge of which errors are safe to retry.
- Multipart upload for large files, and cleanup when it fails halfway.
- Secrets handling that does not leak a key into a log.
- A way to know the day the SDK it depends on ships a breaking change.

Those gaps are rarely deliberate: the prompt did not ask for them and the demo did not need them. The script is correct for the case in front of its author, and production is every other case.

A generated script looks complete and has never had an owner. There is no one to call when it breaks, no changelog when it changes, no test describing what it was supposed to do. What you actually received is a task: understand it, harden it, watch it, indefinitely.

## What Shipping Without Knowing Looks Like

Generated code is not worse than human code on average, but it arrives faster than anyone can review it. A team that wrote five scripts a quarter can now produce fifty, with the same reviewers.

Typical failures:

- The script works on the author's laptop and fails on a worker with a different Python version or a missing system library.
- A dependency is pinned nowhere, so a Tuesday upgrade changes behavior on a Wednesday run.
- An API the script calls changes a field name, and the script keeps "succeeding" while writing nulls.
- The one person who knew why a flag was set leaves, and the flag becomes folklore.

None of this shows up in a demo. It shows up at 3 a.m., in a flow that is by then part of a business process. The orchestrator reports a green run because the script exited with code 0.

## A Plugin Is a Contract, Not a Snippet

A Kestra plugin is Java code that lives in its own repository, has an owner, and is released like any other piece of software. A few things follow from that.

It declares its inputs. Every task property has a type, a default, a description and validation rules. Kestra generates a [JSON Schema](https://json-schema.org/) from the plugin, and the editor uses it to validate your flow before it ever runs. A typo in a property name is a red underline in the editor, not a failed execution at midnight. A script takes whatever string you hand it.

It documents itself. The reference docs, the examples and the property tables on the [plugin pages](/plugins) are generated from annotations in the code. The documentation cannot drift away from the behavior, because they come from the same source. We cover this in the [plugin developer guide](/docs/plugin-developer-guide/document).

It is tested. Each plugin ships with unit tests built on the Kestra test framework, and many run against real services in containers. The checks run on every pull request, and the main branch of each plugin is also built on a schedule on weekdays, so a break caused by something that changed upstream shows up even when nobody touched the code.

It is released and indexed. Plugins are published as versioned artifacts, and the release and indexing process is itself a set of Kestra flows. We wrote about how we ship them in [How Kestra Ships 1300+ Plugins](/blogs/2026-04-27-how-kestra-ships-plugins). A weekly compatibility run builds the plugin library against the latest development branch of Kestra core, so a breaking change in the engine is caught by us, not by you.

It is scanned. Dependencies get automated update proposals and every repository runs a security scan. A CVE in a transitive dependency of a client library is our problem to find and fix. In a script, it is a problem nobody knows they have.

This is dull work, and it is what separates code that ran once from code you can build a business process on.

## Supported for the Life of the LTS

The part that does not exist for a script is the support window.

Kestra publishes [LTS releases](/docs/releases) that are supported for one year, with up to two active at the same time. Security and bug fixes are backported to every supported line, and patch releases ship weekly. Plugins follow the same promise: the plugins that belong to an LTS release are supported for as long as that LTS is. If you pin an LTS, you are not signing up to chase upstream changes in every integration you use.

That changes the question you ask yourself. With a script, you ask "does it work today?" With a supported plugin, you ask "who is responsible if it stops working?" and the answer is written down.

For Enterprise customers, plugins are part of the offer and the service, not an extra:

- Enterprise-only plugins for platform, network and security tooling, delivered from the Kestra registry under your license.
- [Versioned plugins](/docs/enterprise/instance/versioned-plugins), so you can run two versions of the same plugin side by side, test the new one in development, and promote it on your own schedule.
- [Allowed and restricted plugins](/docs/enterprise/governance/allowed-plugins), so a platform team decides which integrations are available to which teams.
- A support contract that covers the plugin, not just the engine underneath it.

A script you generated has none of this. It cannot, because nobody stands behind it.

## Why a Library of Shared Scripts Is Not the Same Thing

Some automation platforms build their ecosystem around a hub of reusable scripts: a catalog where you pick a script, copy it into your workspace, and edit it. It is a reasonable way to start, and it gets you moving quickly.

The trade-off shows up later. A script copied into your workspace is now your fork. When the upstream author fixes a bug, or the API it calls changes, your copy does not move. Nobody tells you, and nobody is on the hook to. Over a year you end up with dozens of slightly different versions of the same integration, each one "working", none of them owned.

A plugin works the other way around. There is one implementation per integration, maintained in one place, versioned, and upgraded by changing a version number in one place. Your flow references the task type:

```yaml
id: nightly_export
namespace: company.data

tasks:
  - id: query
    type: io.kestra.plugin.jdbc.postgresql.Query
    url: jdbc:postgresql://db:5432/app
    username: "{{ secret('PG_USER') }}"
    password: "{{ secret('PG_PASSWORD') }}"
    sql: SELECT * FROM orders WHERE created_at > current_date - 1
    fetchType: STORE

  - id: upload
    type: io.kestra.plugin.aws.s3.Upload
    from: "{{ outputs.query.uri }}"
    bucket: company-exports
    key: orders/{{ execution.startDate | date('yyyy-MM-dd') }}.ion
```

There is no connection logic to copy, no retry code to review, and no SDK to pin. Both tasks have typed inputs, typed outputs, and a schema your editor checks while you type. When the AWS plugin ships a fix, every flow that uses it gets the fix on the next version bump, without anyone editing a file.

## Where Scripts Still Belong

Scripts have their place, which is why Kestra ships Python, Shell and Node.js tasks (see the [Python script task](/plugins/plugin-script-python)).

Use a script when:

- The logic is yours: a business rule, a transformation, a model call that exists nowhere else.
- No plugin covers the system, or the integration is so small it is not worth a plugin.
- You are prototyping and want an answer before you want a design.

Use a plugin when:

- You are talking to a system someone else owns, such as a cloud service, a database, a SaaS API or a message broker.
- The call has to survive credential rotation, API changes, large payloads and partial failure.
- The flow will still be running after the person who wrote it has moved on.

The two combine well. The script holds the part that is unique to your business, and the plugins handle everything around it: fetching the input, authenticating, storing the output, alerting on failure. The script stays short because it no longer has to be an integration layer.

## AI Makes the Case Stronger, Not Weaker

If anyone can write an integration in seconds, why maintain one? Because cheap generation moves the bottleneck from writing code to trusting it. Which of these fifty scripts is safe to run on production data? Who reviewed it? What happens when the vendor changes the API? A maintained plugin answers those questions once, for everyone, instead of fifty times and badly.

AI also helps on the plugin side. Our own squad uses agents to build and review plugins, and we described how in [Context Engineering in Practice](/blogs/context-engineering-plugins-squad). The difference is that the output goes through the same pipeline as everything else: review, tests, compatibility checks, release. Agents make us faster, and the gates stay.

If you use an assistant to write your flows, the best thing it can do is pick a plugin instead of inventing an integration. That is also why we publish the [MCP and docs tools](/blogs/2026-04-30-kestra-mcp-plugins-blueprints): so that an agent writes `io.kestra.plugin.aws.s3.Upload` and not forty lines of boto3.

## The Question to Ask

Before you ship the next script into a production flow, ask three things:

1. Who owns this when it breaks?
2. How will I know when the thing it depends on changes?
3. Is there a version of this that someone is already paid to keep working?

If the answer to the third question is yes, you probably want the plugin. If the answer is no, write the script, put it in a flow, and let Kestra handle everything else around it.

Browse the full catalog on the [plugins page](/plugins), or read the [plugin developer guide](/docs/plugin-developer-guide) if the integration you need is missing. For the Enterprise offer, including supported plugins across LTS releases, [talk to us](/demo).
