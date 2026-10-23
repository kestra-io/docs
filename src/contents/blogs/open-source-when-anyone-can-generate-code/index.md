---
title: "What Open Source Is For When Anyone Can Generate Code"
description: "Open source became a distribution channel, GitHub stars got cheap, and AI changed who writes contributions. What still makes an open-source project worth building and trusting."
date: 2026-10-26T13:00:00
category: Company News
author:
  name: Emmanuel Darras
  linkedin: https://www.linkedin.com/in/emmanuel-darras/
  image: edarras
  role: CEO & Co-founder
---

Ten years ago, open source meant people building something together. You shared your codebase, others showed up, and the product grew out of their contributions. Many of us still picture it that way.

For most organizations today, open source means they can use the software for free. Companies run it to automate their work, and most of them never contribute a line or pay anything. The people behind those projects worked nights and weekends so that a large company somewhere could run its pipelines on their code. I'm fine with that deal, because it's also how good software gets distributed now.

## Open Source Became Distribution

An engineer finds an open-source tool without talking to sales, runs it on a laptop, and brings it to work. If it holds up, the team adopts it. Once the team depends on it, the company starts asking for support, governance and guarantees. An open-source company finds its customers among the people who already run its code.

The projects that get adopted rise to the top, and the most visible sign of that is still the GitHub star.

## What Is a Star Worth Now?

A small AI tool can now collect tens of thousands of stars in a few days. For a tool like that, a star is a bookmark.

An orchestrator gets starred differently. Nobody moves production pipelines or infrastructure to something they found over the weekend. They start with one workflow their current tool handles badly, and if it works, the next ten follow before the team and the security review get involved. A star on that kind of software usually means someone tried it on real work.

Kestra crossed 30,000 stars this week, and almost none of them came from a viral moment. They came one workflow at a time.

## AI Moved the Cost to the Reviewer

This year changed who writes the contributions.

During [Kestra Hacktober](/hacktober), people outside the team opened almost 5,000 pull requests in three weeks, eleven times more than in October last year. They came from 472 contributors, and 412 of them had never contributed to Kestra before. The merge rate fell from 71% last October to 53%.

Coding assistants removed most of the effort it takes to open a pull request. Most people use them well, to learn faster and to contribute to projects they would never have touched before. The effort moved to the person reviewing the code, and at more than 200 pull requests a day, the review is now the bottleneck.

A model knows every language and what a workflow engine usually looks like. It doesn't know why ours is built the way it is: which component owns what, which mechanism already exists two layers down, what must never happen. The engineers who built the product carry that knowledge. When a contribution misses, it's usually because it was written without it. Our Lead engineer Loïc is going to share more about that in an upcoming article.

## There Is Still a Place for Open Source

Anyone can now generate a project from a prompt, and that makes reviewed code worth more. Code designed and maintained by people who understand the whole system is hard to generate, and open source keeps that work visible to anyone who wants to check it.

Contributions also need someone to point them somewhere. Our engineers write and scope every [good first issue](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues) so that a newcomer, or a newcomer's assistant, can land the change in the right place. People can write the code with AI; our engineers decide where it goes and review it.

Agents make this more pressing. When an AI agent acts in production, companies want to know exactly what it will do, and with open source they can read the code to find out. That's why our [docs](/docs) and [plugins](/plugins) are available as Markdown for agents, why any flow can be exposed through the [Kestra MCP server](/docs/ai-tools/mcp-server), and why we [rebuilt the engine for Kestra 2.0](/blogs/2026-09-01-kestra20-rebuild-engine) in the open.

## Thank You

To the 30,000 people who starred Kestra, everyone who sent a pull request or answered a question in our [Slack](/slack), and every team running Kestra in production: **thank you**.

If you want to try it, the [quickstart](/docs/quickstart) is one Docker command, and [Kestra Academy](https://academy.kestra.io) will certify you for free. If you want to contribute, pick a [good first issue](https://github.com/search?q=org%3Akestra-io+label%3A%22good+first+issue%22+is%3Aopen&type=issues) and we'll review it.
