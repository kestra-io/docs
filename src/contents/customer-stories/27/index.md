---
title: Securing Hybrid Cloud Automation Across IT & OT with Kestra
description: How a Fortune 500 industrial company replaced VMware Aria
  Automation with Kestra to cut costs and secure OT operations.
metaTitle: Securing Hybrid Cloud Automation Across IT & OT with Kestra
metaDescription: How a Fortune 500 industrial company replaced VMware Aria
  Automation with Kestra to cut costs and secure OT operations
heroImage: ./hero.jpg
featuredImage: ./hero.jpg
logo: ./logo.svg
logoDark: ./logo-dark.svg
tasks:
  - io.kestra.plugin.ansible.cli.AnsibleCLI
  - io.kestra.plugin.scripts.python.Commands
  - io.kestra.plugin.servicenow.Get
kpi1: |
  ##### 4+1
  Isolated automation platforms (4 OT assets + 1 IT)
kpi2: |+
  ##### 30× faster
  Time to deliver

kpi3: |+
  ##### –90%
  In licensing cost VS Aria Automation

quote: We eliminated the high cost and risk of VMware vRA.  What used to take 6
  months now takes 6 days with Kestra!
quotePerson: Principal Hosting
quotePersonTitle: ""
industry: Heavy Industry
headquarter: Australia
solution: Global leader in heavy industry across the globe
companyName: Fortune 500 Company
---

A Fortune 500 industrial company was running critical hybrid cloud automations on a legacy orchestrator that was becoming *too expensive*, *too opaque to develop on*, and, most importantly, *too risky to keep spanning multiple OT domains*.

**Why Kestra:** They needed a modern, self-hosted orchestration layer that could be deployed **per OT asset**,  enforce **least privilege**, keep execution **site-local**, and integrate cleanly with the tools already doing the heavy lifting (Ansible, Python, ServiceNow, Splunk).

**The result:** A redesigned Hybrid Cloud Automation Platform that’s **segmented by design**, **auditable by default**, and ready to scale across assets—without the licensing burden and operational fragility of the old approach.

## The story

This company’s Hybrid Cloud Automation team sits at the center of a lot of operational reality: provisioning, decommissioning, and remediation workflows that touch everything from virtualization platforms to ITSM processes. For years, VMware Aria Automation (vRA/vRO) was the orchestration front-end. It worked, until it didn’t.

Two forces hit at once.

First: economics. Licensing and total cost started to feel disconnected from the value they were getting.

> “We’re using Aria Automation, that’s a massive cost, the cost doesn’t justify it anymore.”
> 

Second: cybersecurity and OT tenancy realignment. The organization needed stricter separation across OT domains, with a clear requirement that **one orchestration control plane should not span them all**.

> “One of these cyber requirements is no control plane shall span any of them, it could be six separate control planes.”
> 

At that point, “tweaking the current setup” was no longer a plan. They needed a new foundation.

## Why Kestra won

They wanted something that fit the way they already operated: keep **Ansible** for the heavy lifting, keep building **Python** integrations, keep **ServiceNow** as the workflow gatekeeper, and keep **Splunk** as the source of truth for auditability.

> “We use Ansible for the heavy lifting, and we’re developing a lot more API integrations in Python.”
> 

The proof of concept made one thing immediately obvious: day-to-day engineering would get easier. Errors were clearer. Execution was more predictable. Workflows felt less like a black box.

> “[The legacy tool] will give you a very ambiguous message, whereas a native Python runtime shows you exactly.”
> 

And in the practical work of moving automation over, a small but important detail became a big win:

> “Ansible output parsing was a massive win, it's deterministic and made our life so much easier.”
> 

Kestra aligned with the requirements that mattered most: self-hosted, air-gapped deployments, per-asset isolation, remote workers in OT domains, AD-backed authentication, least-privilege RBAC, and centralized logging to the enterprise SIEM.

## Before Kestra / After Kestra

**Before:** Automation was effective, but the orchestration layer was increasingly costly and harder to evolve. OT requirements were pushing the platform away from shared constructs, and debugging workflow failures could be slow and frustrating.

**After:** The orchestration model became a platform pattern: **deploy per asset**, keep execution local with **remote workers**, restrict ingress/egress through approved OT network zoning, and treat workflows like real software—versioned, reviewable, and observable.

It changed the operating posture: instead of hoping the orchestrator could be “contained,” containment became the default architecture.

## What they run on the platform

A typical flow might look like: provision a server from a vCenter template, wait for completion, run Ansible to configure it and join domains, install required agents, then update the ServiceNow CMDB and notify stakeholders.

> “Clone it from the template then we run a playbook and join it to the domain, install all the agents and then create the entry in ServiceNow.”
> 

They also automate the other half of the lifecycle—decommissioning—driven by ServiceNow approvals, and they wire monitoring signals into action: alerts from Splunk/SCOM can trigger triage and remediation steps, with the incident updated automatically.

> “A server might throw up a 100% CPU alert, we pick that alert up and then we have an automation workflok that update the incident in ServiceNow.”
> 

## The outcome: security posture and operability improve together

It is a controlled redesign with clear operational benefits:

- **OT security posture improved** because the platform is segmented by default and easier to isolate during a cyber event.
- **Operational risk dropped** because automation that can be disruptive is contained inside the asset boundary.
- **Engineering velocity improved** because workflows are clearer to develop, easier to debug, and more deterministic—especially when orchestrating Ansible and Python.
- **Governance got simpler** because audit trails and execution events land in Splunk and access is built around least privilege.

Or as one engineer described the experience:

> “Everything come from the UI with dynamic dropdown and then the magic green button and off we go.”
> 

## What’s next

The rollout is intentionally phased. The company expects a transition period where both the legacy orchestrator and Kestra coexist while workflows migrate and remaining management interfaces are realigned to their target OT tenancies. But the direction is clear: Kestra is **becoming the control plane pattern for hybrid cloud automations** that must operate safely across multiple OT environments.
