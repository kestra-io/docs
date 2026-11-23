---
title: "Kestra and Bitovi: Platform Engineers Who Build With You"
description: "Bitovi, the platform engineering consultancy, is a Kestra partner. Platform assessments, builds, ongoing support, and help with Kestra upgrades."
date: 2026-11-19T19:00:00
category: Company News
author:
  name: Robert Walters
  linkedin: https://www.linkedin.com/in/robwaltersprofile/
  image: "rwalters"
  role: Senior Technical Product Marketing Manager
image: ./main.webp
---

**We are excited to announce that [Bitovi](https://www.bitovi.com/?utm_source=kestra&utm_medium=referral&utm_campaign=partners) is a [Kestra](/) partner. If you want an outside review of your Kestra setup, senior engineers to build with your team, or someone to keep the platform running after launch, Bitovi can help.**

## About Bitovi

Bitovi is a US consultancy that has been delivering software engagements since 2006. Their platform engineering team builds internal developer platforms, golden paths, and production infrastructure, and their engineers run Kubernetes, CI/CD, and GitOps in production for clients.

Kestra is part of that practice. Bitovi helps teams set up Kestra workers and flows with the right patterns, and figure out where Kestra should sit in a stack that already has a scheduler, a CI system, and legacy scripts nobody wants to touch.

## What Bitovi offers

Bitovi works with Kestra teams in three ways:

- Assessment: a review of your platform at whatever stage it's in, ending with a scored report and a prioritized roadmap
- Build: senior platform engineers working alongside your team on a defined scope, such as standing Kestra up [on Kubernetes](/docs/installation/kubernetes), wiring it into your CI/CD and Git workflow, or setting up golden paths so new teams start from a working template instead of a blank YAML file
- Support: operations, upgrades, and roadmap work once the platform is live, with training so your team ends up owning it

## Kestra upgrades

For teams still on previous versions of Kestra, Bitovi has a migration package for the move to Kestra 2.0. The upgrade starts from 1.3 and the cutover is one-way: 2.0 drops the old JDBC queue tables on startup, so a database backup is your only way back. Most flows carry over unchanged, and the rest fall into two groups:

- Changes `kestra-migrate` rewrites for you, such as `json()` to `fromJson()` or `condition` to `when` on flow-level checks
- Changes you rewrite by hand, such as trigger conditions, which the tool flags with a warning and leaves in place

With a handful of flows, you can work through the [2.0 migration guide](/docs/migration-guide/v2.0.0) yourself. With a few hundred across namespaces and teams, it's worth having someone who has done it before. In the replay below, Bitovi engineering team's walk through the process: sizing the work with `kestra-migrate --check`, applying the automated rewrites, fixing what's left by hand, and validating with `kestractl` before the switch.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/afVQsI9uNyI?si=7K4vsqQ6sr-wHRKC" title="Best Practices for Upgrading to Kestra 2.0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Choosing a Kestra edition

If you are still deciding how to run Kestra, Bitovi published a video on Kestra's editions, architecture, and trade-offs on their YouTube channel. You can also compare editions in our [Open Source vs. Enterprise guide](/docs/oss-vs-paid).

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/M9HoRSY7lCk" title="Kestra Explained: Editions, Architecture, and Trade-offs" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Get started

- Visit Bitovi's [partner page](/partners/bitovi)
- Read about Bitovi's [platform engineering services](https://www.bitovi.com/services/platform-engineering-consulting?utm_source=kestra&utm_medium=referral&utm_campaign=partners)
- [Contact Bitovi](https://www.bitovi.com/contact?utm_source=kestra&utm_medium=referral&utm_campaign=partners) about an assessment, a build, or a Kestra upgrade

If you're planning a production rollout and want a second set of hands, Bitovi is a good place to start. And if you have questions for us, join the [Kestra community on Slack](/slack); we would love to hear what you build.
