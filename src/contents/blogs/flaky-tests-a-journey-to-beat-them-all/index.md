---
title: "Flaky Tests: a journey to beat them all"
description: "How Kestra engineers enter into a journey to solve flaky tests."
date: 2026-01-15T13:00:00
category: Solutions
author:
  name: Loïc Mathieu
  image: lmathieu
  role: Lead Developer
image: ./main.jpg
---

> “Sleep is not a synchronization primitive.”

Every test engineer, eventually

## What’s a flaky test?

A **flaky test** is a test that sometimes passes and sometimes fails without any code changes. They’re the by‑product of non‑determinism: timing, concurrency, eventual consistency, network hiccups, clock drift, resource contention, and (our favorite) **tests leaking state across runs**.

At Kestra, we run **6,000+** tests across our repositories. We add dozens every day. If only **1%** of those are flaky at **10%** failure probability, you’ve got **~50** flaky tests. Expectation math says **~5 failures per CI run**, good luck spotting real regressions under that noise.

As an orchestration platform, many of our tests execute **parallel, asynchronous workflows**. Async is powerful and naturally tricky to test: ordering isn’t guaranteed, and “eventually consistent” is not a helpful assertion.

One of our top issues is due to our queuing system; a test may receive a message from another test or miss a message from the queue. We strive to properly close the queue and handle all messages to ensure they are not leaked across tests, but it’s challenging to guarantee this.

Last year, CI was red often enough that we decided to go on a proper flake‑hunting journey.

## First try: retry them all!

Our first try to bite them all was to retry the flaky tests.

Kestra is built in Java, and tests are written with the JUnit framework. The JUnit Pioneer extension contains an annotation that allows for retrying a test if it fails: `@RetryingTest(5)`. We added this annotation to every test that often fails in our CI.

This helped…a bit. However, it also **inflated test times** and **masked real issues**. Worse, some failures are **structural** (leaked resources, race conditions): once they fail, they continue to fail, regardless of how often you retry.
Verdict: good band‑aid, bad cure.


## Second try: fix them all!

We then decided to put in the effort to fix the failing test! We removed all the usage of the `@RetryingTest(5)` annotation and either fixed the test or disabled it.

As most flaky tests launch a workflow and assert on its execution, we improved our testing framework in this area to ensure that every test properly closes its resources, and every workflow and execution created by a test will be deleted.

For that, we created a JUnit extension to manage test resource creation:
- A `@KestraTest` annotation handles starting and closing the Kestra runner in the scope of a test class.
- A `@LoadFlows` annotation handles loading and then removing flows in the scope of a test method.
- A `@ExecuteFlow` annotation handles starting and then removing a flow execution in the scope of a test method.

Using this test framework consistently allows us to exert more control over resource allocation and deallocation, enabling us to clean up any flow or execution created by a test and avoid potential test pollution with unrelated resources.

However, after weeks of effort, we had to disable too many tests. Although the number of flaky tests decreased, some were still failing, albeit rarely. Given the high number of tests we have, this would still cause our CI to suffer.

## Third try: embrace the inevitability!

So, tests will fail; we had to accept that, sometimes often, sometimes rarely, but tests will fail.
We must be pragmatic and accept the inevitability of tests being flaky.

We decided to flag flaky tests and allow them to fail in the CI! This was not an easy decision, as nobody wants to concede failure and accept it. However, to achieve a reliable CI without compromising test coverage and increasing testing implementation time, we must avoid disabling tests and accept that some will fail frequently.

To flag a flaky test, we annotate it with `@FlakyTest`, which is a custom marker annotation that encapsulates Junit `@Tag("flaky")` annotation.
JUnit tags are very accurate for such use cases; they allow you to target a group of tagged tests when running your tests.

Our CI now launches tests in two steps:
- First, tests non-tagged as flaky: those must pass for the CI run to be green.
- Then, tests tagged as flaky: those can fail.

We also improve our CI to report differently standard tests and flaky tests, with a test summary in the PR comment that directly contains the list of failing tests with their stack traces. This allows us to better pinpoint any test issues.

Of course, flagging a test as flaky is an easy thing to do, so we take care of it first by trying to fix the test and only tag it as flaky as a last resort.
We have test observability in place to track flaky tests, so if they increase significantly, we would be aware.

## Conclusion

You won’t beat every flaky test. That’s fine. The goal is to get **reliable signals** back into CI so you can confidently merge and ship. Separate what must be green from what’s allowed to wobble, invest in deterministic test lifecycles, and keep an eye on the flaky set, so it doesn’t quietly grow.

Flakes are inevitable. **Letting flakes dictate your delivery is optional.**
