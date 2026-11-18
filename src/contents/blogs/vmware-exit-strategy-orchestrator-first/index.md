---
title: "Leaving VMware? Start With the Orchestrator, Not the Hypervisor"
metaTitle: "VMware Exit Strategy: Replace vRA and vRO First"
description: "Planning a VMware exit? Replace vRA and vRO first, keep ServiceNow, Terraform and Ansible, and move to Nutanix or Proxmox on your own schedule."
date: 2026-11-19T10:00:00
category: Solutions
author:
  name: Fernando Mattos
  linkedin: https://www.linkedin.com/in/fbmattos/
  image: fmattos
  role: Solutions Marketing Lead
image: ./main.png
---

Most teams planning to leave VMware start with the hypervisor. They compare Nutanix and Proxmox, price out the move, and plan how to get the VMs across. What very few plan is the automation that runs on top of it: the vRA catalog people request machines from, the vRO workflows behind every request, and the Day 2 actions that keep the environment running. The teams we talk to, and the partners who help them migrate, describe the same thing. The hypervisor move gets a plan, and the automation gets discovered halfway through.

In our November 4 webinar, Faizan Qazi and I made the case for starting with the orchestrator instead, and showed what that looks like with Kestra. Below are the key moments, with the full recording at the end.

<div class="key-takeaways">
<p class="key-takeaways-label">Key takeaways</p>
<ul>
<li>Replace vRA and vRO first, and the hypervisor becomes a separate decision.</li>
<li>Kestra replaces both, and your ServiceNow, Terraform and Ansible stay where they are.</li>
<li>Start with the open source Migration Assistant, which runs on your own machine.</li>
</ul>
</div>

## Most VMware Exit Plans Start in the Wrong Place

If you run VMware, vRA and vRO are most likely your orchestration layer, and they were built for vSphere. Every catalog request, lifecycle event and Day 2 action runs through them, along with the integrations to ServiceNow, Terraform, Ansible and your CMDB. That layer is what ties you to vSphere, and it's increasingly priced and scoped by VMware. vRA is now sold only as part of [VMware Cloud Foundation](https://kestra.io/vs/vmware-cloud-foundation), licensed per core on subscription, so the automation is now priced as part of the hypervisor. What it can reach is VMware's call too: several vRO plugins were deprecated in VCF 9, and native AWS, Azure and GCP management were deprecated and switched off by default.

Replacing the orchestrator first turns the hypervisor into a separate decision, and an easier one. With Kestra running your automation, ServiceNow, Terraform, Ansible and your CMDB stay where they are, and you can keep vSphere, move some workloads to Nutanix or Proxmox, or move all of them, on your own schedule. If you're still choosing the hypervisor, Diego Arias compares [seven VMware alternatives, scored for your scenario](/blogs/vmware-alternatives-scorecard). If you move the hypervisor first, the VMs move but the vRO workflows that provisioned and patched them don't, so you still have to replace the orchestrator, just later and under more pressure.

<blockquote class="pull-quote">
<p>"The big thing that teams miss is that the reason they're stuck with VMware is the orchestration layer."</p>
<p class="pull-quote-attribution">Fernando Mattos, Solutions Marketing Lead at Kestra, in the webinar</p>
</blockquote>

<figure class="video-poster">
<a href="https://www.youtube.com/watch?v=oDmypfno4oc&t=286s" target="_blank" rel="noopener" aria-label="Watch this part of the webinar on YouTube (opens in a new tab)">
<span class="video-poster-play" aria-hidden="true"></span><span class="video-poster-duration">1:10</span>

![Today vRA and vRO lock you to vSphere; with Kestra as the orchestrator you keep vSphere or move to Nutanix or Proxmox, and ServiceNow, Ansible, Terraform and Slack stay](./01-orchestrator-first.png)

</a>
<figcaption>Replace the orchestrator first, and the hypervisor becomes a separate decision. Watch why (about a minute).</figcaption>
</figure>

## Why Moving Hypervisors Feels Impossible

Moving the VMs themselves is well understood, and there are tools for it. The automation is what makes the move feel impossible. Every vRO workflow that provisions, patches or decommissions a machine has to be recreated for the new platform, the old and new setups have to run side by side until the move is done, and most teams don't know where to start because they aren't sure what they have. In most environments we see some version of the same picture:

- Years of accumulated vRO workflows, many written by engineers who have since left or by outside consultants.
- Unclear dependencies between workflows, actions and the systems they call.
- Custom JavaScript in vRO scriptable tasks, written against vRO's own APIs, that fewer and fewer engineers can read and change.
- Automation that works in production today, and a real risk of breaking it.

So teams stay. The will to leave is usually there, and what holds them back is the risk of breaking automation they don't fully understand. The teams we talk to tell us they don't see vRO as a long-term option, and the alternative many of them have landed on is writing their own scripts. Scripts can recreate the provisioning, but not what vRA gave you around it: a catalog people request from, a record of who ran what, and an inventory of what was provisioned.

## Kestra Replaces Both vRA and vRO, and Keeps the Rest of Your Stack

Kestra is an open source orchestrator (Apache 2.0), with an Enterprise edition built on the same engine, and it runs in production at companies like Apple, JPMorgan Chase and Dataport. Flows are declared in YAML, so they live in Git and get reviewed like any other code, and plugins connect them to the tools you already run. It replaces both VMware layers, the vRO workflow engine and the vRA catalog, deployments and Day 2 actions. Here's how the pieces map:

| In vRA and vRO | In Kestra |
| --- | --- |
| Workflows and scriptable tasks | Flows declared in YAML, kept in Git and promoted like code |
| Package files exported and imported by hand | Git, with review and promotion between environments |
| Actions and vRO plugins | Kestra plugins for [vSphere](https://kestra.io/plugins/plugin-ee-vmware), [Nutanix](https://kestra.io/plugins/plugin-ee-nutanix), [Proxmox](https://kestra.io/plugins/plugin-proxmox), [ServiceNow](https://kestra.io/plugins/plugin-servicenow), public clouds and more |
| Configuration elements | Namespaces, the KV store, and secrets from the vault you already use |
| Service Broker catalog items | Kestra Apps with dynamic forms |
| Deployments | Assets that track what was provisioned |
| Day 2 actions | Flows that act on assets, run from an App, on a schedule, or when an asset changes |
| ServiceNow, Terraform, Ansible, your CMDB, IPAM and vault | They stay where they are, and Kestra calls them through plugins |

**Note:** The vSphere and Nutanix plugins, Apps and external secrets managers in this mapping are Kestra Enterprise features.

In the webinar, we walked through one load balancer's full lifecycle in vRA and vRO, from creating it to adding and removing machines and deleting it. Here's what that takes in vRA:

<figure>

![In vRA, one load balancer is 11 pieces: a catalog item and cloud template, five event subscriptions, and four vRO workflows, wired together by event topics](./04-vra-lifecycle.png)

<figcaption>The load balancer lifecycle in vRA, as built in our lab.</figcaption>
</figure>

And here's the exact same lifecycle in Kestra, where each step is an App:

<figure class="video-poster">
<a href="https://www.youtube.com/watch?v=oDmypfno4oc&t=2074s" target="_blank" rel="noopener" aria-label="Watch this part of the webinar on YouTube (opens in a new tab)">
<span class="video-poster-play" aria-hidden="true"></span><span class="video-poster-duration">2:10</span>

![Four Kestra Apps for the load balancer lifecycle: create a load balancer, delete a load balancer, add a machine to a load balancer and remove a machine from a load balancer, each with a Request button](./05-kestra-catalog.png)

</a>
<figcaption>Watch it run in Kestra (about 2 minutes).</figcaption>
</figure>

## Move Without a Big Rewrite, or Rebuild If That's Easier

The first step is finding out what you have. The open source Kestra Migration Assistant reads your vRO package export (and your vRA export, if you have one) on your own machine and produces a brief your team can plan from:

- What each workflow does, and which systems it touches.
- Which Kestra plugins cover those systems.
- A recommendation for each workflow, including which ones to retire.
- A migration plan in waves, from the lowest-risk workflows to the catalog itself.

It was built to be safe to run in a locked-down environment. It sanitizes secrets and IP addresses before anything goes to a model, sends no telemetry, works with whichever model your company has approved (or with no model at all), and doesn't need Kestra installed.

<figure>

![The Migration Assistant's plan in six waves: CMDB registration, load balancer lifecycle, DNS/IP/Active Directory, VM provisioning and Day 2, then the load-balanced web tier and standard Linux server catalog items as Kestra Apps](./02-migration-waves.png)

<figcaption>The Migration Assistant's plan for a sample environment, in six waves.</figcaption>
</figure>

From there the move goes wave by wave, with vRA still running everything that hasn't moved yet. The conversion is the other half of the Migration Assistant, and we run it with your team. Each wave is converted and verified before it touches your systems. Tests are written from the original workflows first, the converted flows run in a lab that simulates vCenter and mocks the systems your workflows call (F5, Avi, ServiceNow and others), and the results are checked against what the vRO workflows did. The next wave starts once the last one is verified in production.

<figure class="video-poster">
<a href="https://www.youtube.com/watch?v=oDmypfno4oc&t=1919s" target="_blank" rel="noopener" aria-label="Watch this part of the webinar on YouTube (opens in a new tab)">
<span class="video-poster-play" aria-hidden="true"></span><span class="video-poster-duration">1:27</span>

![The conversion harness: the original vRO workflows and the brief go into the VMware Migration Lab, which loops through writing tests, drafting flows and running them until every test passes, and out comes a green wave for an engineer to review](./03-conversion-harness.png)

</a>
<figcaption>How each wave is converted and verified before it reaches your systems. Watch how we check it (about 90 seconds).</figcaption>
</figure>

Some teams skip conversion and rebuild instead, and that's easier than it sounds when catalog items become Apps and plugins replace most of the custom JavaScript. One EU federal agency with roughly 1,600 vRO workflows chose to rebuild rather than convert. Most environments end up with a mix: convert the workflows that are clean, rebuild the ones that are messy, and retire the ones nobody uses.

[Talk to us](https://kestra.io/demo) and we'll walk through the assessment with you, or [run the Migration Assistant yourself](https://kestra.io/resources/migration/vra/assistant) first.

## Get What vRA Never Gave You

Replacing the orchestrator is also a chance to get things vRA and vRO never offered.

**An inventory you can reason about.** Every deployment is an asset with its dependencies, so before you update the certificate on a load balancer's virtual server, you can see which machines the change would affect. Asset lifecycle events can also trigger flows, so deleting a machine runs the flow that removes it from the pool.

**A safe place for AI agents.** vRO has no built-in way to run AI agents. In Kestra, an agent works inside a flow, and the flow defines what it can touch, who approves its changes, and what goes into the audit trail. [Kai's post on AI agents for infrastructure automation](https://kestra.io/blogs/ai-agents-infrastructure-automation) covers what agents can realistically do for infrastructure teams today.

## Where to Start

We asked Faizan Qazi, a Senior Solutions Engineer at Kestra who built vRA and vRO workflows for enterprises at VMware, what a team running vRO should do first, before talking to any vendor. His advice:

:::alert{type="info"}
**Before you talk to any vendor**

- Map what your workflows touch: the systems they talk to, and the risk of moving each one.
- Take stock of what you've built, from your vRO libraries and JavaScript to the Terraform modules and Ansible playbooks they call.
- Check what a new platform supports natively. Anything it doesn't becomes boilerplate your team writes while keeping business as usual running.
:::

When you're ready for the next step:

- [Talk to us](https://kestra.io/demo), and we'll look at your environment with you and show what replacing vRA and vRO would take.
- The [vRA migration guide](https://kestra.io/resources/migration/vra) walks through the decisions and the plan, and the [payback calculator](https://kestra.io/resources/migration/vra/payback) shows whether the move pays off for your team.
- [Run the Migration Assistant](https://kestra.io/resources/migration/vra/assistant) on the sample files, then on your own export.
- Watch [an 8-minute walkthrough](https://www.youtube.com/watch?v=brZo-5NdP2E) of infrastructure automation with Kestra.

## Watch the Full Webinar

<div class="video-container"><iframe src="https://www.youtube.com/embed/oDmypfno4oc" title="Moving Off VMware? Start With the Orchestrator" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

Jump to a part of the webinar:

- [Welcome and introductions](https://www.youtube.com/watch?v=oDmypfno4oc&t=0s)
- [Why start with the orchestrator](https://www.youtube.com/watch?v=oDmypfno4oc&t=98s)
- [Challenges with VMware infrastructure](https://www.youtube.com/watch?v=oDmypfno4oc&t=217s)
- [Introduction to Kestra](https://www.youtube.com/watch?v=oDmypfno4oc&t=358s)
- [Managing vRA and vRO with Kestra](https://www.youtube.com/watch?v=oDmypfno4oc&t=525s)
- [The vRA migration guide](https://www.youtube.com/watch?v=oDmypfno4oc&t=591s)
- [Overview of the Migration Assistant](https://www.youtube.com/watch?v=oDmypfno4oc&t=687s)
- [Migration Assistant demo](https://www.youtube.com/watch?v=oDmypfno4oc&t=867s)
- [Migration waves and strategy](https://www.youtube.com/watch?v=oDmypfno4oc&t=1801s)
- [Conversion and testing approach](https://www.youtube.com/watch?v=oDmypfno4oc&t=1920s)
- [Demonstration of migrated workflows](https://www.youtube.com/watch?v=oDmypfno4oc&t=2026s)
- [Summary and migration path](https://www.youtube.com/watch?v=oDmypfno4oc&t=2435s)
- [Getting started and Q&A](https://www.youtube.com/watch?v=oDmypfno4oc&t=2559s)

## FAQ

### Why are teams migrating off VMware?

vRA is now sold only as part of VMware Cloud Foundation, licensed per core on subscription, so the automation layer is priced with the hypervisor. Several vRO plugins were also deprecated in VCF 9, and native AWS, Azure and GCP management is switched off by default.

### Can I keep vSphere while replacing vRA and vRO?

Yes. Replace the orchestrator first and the hypervisor becomes a separate decision: keep vSphere, move some workloads to Nutanix or Proxmox, or move all of them, on your own schedule.

### What replaces vRealize Orchestrator workflows?

In Kestra, vRO workflows and scriptable tasks become flows declared in YAML, kept in Git and promoted like code. Actions and vRO plugins map to Kestra plugins, and Service Broker catalog items become Kestra Apps with dynamic forms.

### Do I have to rewrite every vRO workflow?

No. The open source Kestra Migration Assistant reads your vRO package export and recommends what to convert, rebuild or retire. We run the conversion with your team. Workflows then move in waves while vRA keeps running everything that hasn't moved yet.
