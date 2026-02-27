---
title: "COBOL isn’t the problem, Claude is not the answer, un-orchestrated systems are the problem"
description: "COBOL is back in the headlines. Not because the language suddenly became cool again, but because it’s a reminder of something the industry keeps forgetting: the world still runs on “old” systems."
date: 2026-02-27T13:00:00
category: News & Product Updates
author:
  name: Martin-Pierre Roset
  image: mproset
image: ./main.jpg
---

Every time COBOL comes up, the conversation takes the same shortcuts.

We get the jokes about punch cards. We get the hot takes about “just rewrite it.” And now we get the newest shortcut: **“AI will solve it.”**

AI can help. But [Claude is not the answer](https://claude.com/blog/how-ai-helps-break-cost-barrier-cobol-modernization).


The problem is that these systems are often **un-orchestrated**: held together by brittle scheduling, manual handoffs, shaddy dependencies, and knowledge that lives in people’s heads. That’s where the risk is. That’s why modernization feels scary. That’s why teams avoid change until they have no choice. Modernization doesn’t start with rewriting.  

If you missed the latest drama around COBOL & Claude, Will put together a recap video and a demo of both integration in Kestra.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/_SQWQoaCkLM?si=L5Q4qjKlkm_AuoIs" title="Does Claude Actually Know COBOL?" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>


## Orchestration is the modernization layer legacy systems never had

Most enterprises don’t have “a COBOL system.” They have an estate.

A core system on IBM i: Nightly jobs with strict execution order. Flat files that became contracts. DB2 tables that downstream teams query directly. A few newer services bolted on over time. A warehouse pipeline ingesting outputs because “that’s how it’s always been done.”

When people say “modernize,” they usually imagine replacing the code.

But in practice, the modernization challenge is the *system* around the code: when it runs, what it depends on, what it produces, how failures propagate, which downstream workloads assume it completed, and which business teams wake up if it didn’t.

That’s what orchestration is for.

Orchestration makes legacy systems safe to evolve because it makes them observable, repeatable, and governable. It turns “don’t touch it” into “we can change it carefully.”

## What Kestra enables: operate legacy like modern, without pretending it’s going away

We don't cosplay Kestra as a COBOL-to-Java converter.

Kestra is here to do something more useful: give you a control plane for hybrid reality, where legacy workloads and modern workloads coexist, and where modernization happens in small, validated steps.

That’s why we ran [COBOL](https://kestra.io/plugins/plugin-cobol) inside Kestra.

Not because “Hello World” is impressive, but because it demonstrates the shift: COBOL can be treated like any other workload. Containerized. Executed on demand. Logged. Versioned. Auditable. Reproducible.

Here’s the exact workflow we used to compile and run a COBOL program with GNU Cobol:

```yaml
id: cobol
namespace: company.team

tasks:
  - id: run_cobol
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      hello.cbl: |
        000100 IDENTIFICATION DIVISION.
        000200 PROGRAM-ID. HELLO-WORLD.
        000300 
        000400 PROCEDURE DIVISION.
        000500     DISPLAY 'HELLO FROM KESTRA'.
        000600     STOP RUN.
    beforeCommands:
      - apt update -y 
      - apt install -y gnucobol
    commands:
      - cobc -x hello.cbl
      - ./hello 

```
And if you prefer “free format” COBOL:

``` yaml
id: cobol_free
namespace: company.team

tasks:
  - id: run_cobol_free
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles:
      hello.cbl:|
        IDENTIFICATION DIVISION.
        PROGRAM-ID. HELLO-WORLD.

        PROCEDURE DIVISION.
            DISPLAY 'HELLO FROM KESTRA'.
            STOP RUN.
    beforeCommands:
      - apt update -y
      - apt install -y gnucobol
    commands:
      - cobc -x -free hello.cbl
      - ./hello
```

This is already a modernization step—even though it doesn’t change the business logic. Because it changes the operational posture: the job becomes **portable and governable**.

That’s how modernization actually starts not with rewritting everything with AI.

## Where AI fits: inside orchestrated workflows, not above them

AI is useful when it accelerates work you’d otherwise do manually:

- generating scaffolding
- drafting code variations
- explaining unfamiliar code paths
- turning context into documentation

But AI is not the answer because modernization is not primarily an intelligence problem. It’s a **trust problem**.

> “can we trust the new path as much as the old one?”

Trust comes from execution discipline: reproducibility, validation, observability, and rollback. That’s why AI needs to live *inside* an orchestrated workflow where every output becomes an artifact you can inspect, test, and compare.

Here’s a Kestra workflow that uses an AI agent to generate a COBOL program file, saves it, compiles it, and runs it. Again, the point isn’t that AI can write COBOL—the point is that the whole process is **controlled and auditable**.

> To bring Claude into the workflow, Kestra provides an [Anthropic plugin](https://kestra.io/plugins/plugin-anthropic) that lets you call Claude models from tasks and agents.

``` yaml
id: cobol_ai
namespace: company.team

inputs:
  - id: prompt
    type: STRING
    defaults: "Write me a hello world program in Cobol"

tasks:
  - id: generate_cobol
    type: io.kestra.plugin.ai.agent.AIAgent
    prompt: "{{ inputs.prompt }}"
    systemMessage: "Write a Cobol program based on the prompt. Use dummy data as it's for a demo and not for production. Save the Cobol program as `main.cbl` in the `/tmp` directory by using the provided filesystem tool."
    provider:
      type: io.kestra.plugin.ai.provider.Anthropic
      apiKey: "{{ secret('ANTHROPIC_API_KEY') }}"
      modelName: claude-sonnet-4-6
    tools:
      - type: io.kestra.plugin.ai.tool.DockerMcpClient
        image: mcp/filesystem
        command: ["/tmp"]
        binds: ["{{workingDir}}:/tmp"]
    outputFiles:
      - main.cbl

  - id: run_cobol
    type: io.kestra.plugin.scripts.shell.Commands
    inputFiles: "{{ outputs.generate_cobol.outputFiles }}"
    beforeCommands:
      - apt update -y
      - apt install -y gnucobol
    commands:
      - cobc -x main.cbl
      - ./main
```

When AI is treated as an assistant inside an orchestrated workflow, it becomes useful. When AI is treated as a replacement for operational discipline, it becomes a liability.

So yes: AI can lower the cost of analysis and prototyping.

But orchestration is what turns prototypes into safe change.

---

## IBM i / AS/400: the same lesson, at bigger scale

> If your stack includes IBM i / AS/400, Kestra can [already connect through JDBC](https://kestra.io/plugins/plugin-jdbc-as400/as400) (e.g., to DB2 for i) so those systems can participate in orchestrated workflows instead of living behind brittle schedules.

COBOL gets the spotlight, but IBM i estates are often where the modernization tension is most visible.

Not because IBM i is “outdated,” but because it is often *too important* to be touched casually. The system is stable, the workflows are business-critical, and the surrounding ecosystem has grown around it over years—sometimes decades.

Modernization here rarely means “move off IBM i by date X.”

It more often means:

- integrate IBM i outputs cleanly with modern services and data platforms
- make job scheduling and dependencies explicit
- reduce fragile file handoffs
- add observability and auditability
- gradually move pieces out when the business case is real
- keep reliability as the non-negotiable constraint

All of that is orchestration work.

And because Kestra speaks “hybrid” natively—scripts, containers, APIs, databases, events, and AI—it’s a natural way to modernize the *system around* IBM i without forcing a risky replacement agenda.

---

## The modernization path that doesn’t break production

If your system is critical, you don’t modernize by heroics. You modernize by repeatability.

The approach that scales is the one that treats modernization like controlled engineering:

You keep the legacy path running.

You build the new path in parallel.

You run both.

You validate outputs.

You compare performance.

You promote gradually.

Orchestration makes this feasible because it gives you a single execution layer where “old” and “new” can coexist with shared guardrails and shared observability.

That’s the real shift:

Modernization stops being an irreversible migration project.

It becomes a series of workflows you can run, inspect, and improve.


## Conclusion

AI can help you move faster, but speed without control is how you create outages.

If you want to modernize legacy systems without breaking what made them valuable—reliability, availability, data integrity—start with orchestration. Put execution under governance. Make dependencies explicit. Make runs observable. Make change repeatable.

That’s what Kestra enables: modernization that respects reality.

:::alert{type="info"}
If you have any questions, reach out via [Slack](/slack) or open a [GitHub issue](https://github.com/kestra-io/kestra).

If you like the project, give us a [GitHub star](https://github.com/kestra-io/kestra) and join [the community](/slack).
:::
