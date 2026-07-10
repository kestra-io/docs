---
title: "Plugin Devtools: shell scripts our squad and our agents both run"
description: "Inside Plugin Devtools, the internal repository of shell scripts the Plugins & Ecosystem Squad uses to move faster across 200+ plugin repos, and that our AI agents call straight through the Bash tool instead of re-deriving the same commands and burning tokens."
date: 2026-07-10T09:00:00
category: Engineering
author:
  name: François Delbrayelle
  linkedin: https://www.linkedin.com/in/fdelbrayelle/
  twitter: "@fdelbrayelle"
  image: fdelbrayelle
  role: Lead Software Engineer
---

The Plugins & Ecosystem Squad maintains more than 200 plugin, storage, and secret repositories. A single day can mean spinning up a local Kestra stack, building a shadow JAR, checking which repos have unpushed work, merging a wave of Dependabot PRs, and cutting a few releases. None of it is hard. All of it is repetitive, and every repetition is a chance to forget a flag, point Vite at the wrong port, or release a version that was already tagged.

We had a second, quieter problem too. Once we started routing plugin work through AI agents (see our earlier post on [automating the plugin SDLC](/blogs/context-engineering-plugins-squad)), the agents hit the exact same friction. Ask an agent to "deploy plugin-mqtt locally and restart Kestra" and it will happily reconstruct the Gradle task, the JAR-finding logic, the copy-into-plugins step, and the restart, from scratch, every time. That is slow, it is error-prone, and it costs a surprising number of tokens to re-derive something we already know how to do.

Plugin Devtools is our answer to both. It is an internal repository of standalone shell scripts, one per recurring task, each runnable directly from the terminal. Three goals shaped it:

- Go faster on the operations we do every day, with one command instead of a remembered sequence.
- Keep every script usable by an agent through the Bash tool, so the agent runs `kestra-plugin-shadowjar plugin-mqtt --restart-kestra` rather than improvising the whole flow.
- Stop agents reinventing the wheel. A named command the agent can call is cheaper in tokens and more reliable than a paragraph of reconstructed shell.

That last point is the one people underestimate. A script is a contract. The agent does not need to know how a release avoids duplicate tags or why `gradlew.bat` keeps showing up as modified; it needs to know the command exists and what it does. The messy knowledge lives in the script, versioned once, instead of being re-explained in every agent context.

## Two ways in

Once the scripts are on your PATH there are two entry points. Humans who do not want to remember flags open the `gum`-based TUI:

```bash
plugin-devtools   # alias: plugdev
```

Everything the TUI does is a plain script underneath, and that is deliberate. The menu is a convenience wrapper; the scripts are the product. Agents skip the menu entirely and call the scripts by name with arguments, which is why nearly every one accepts non-interactive flags that bypass the `gum` prompts.

## The inner loop: run Kestra, deploy a plugin

`kestra-core-run` starts the full dev stack (backend, frontend, Postgres, and the ui-libs watcher) from local source, health-checks both services, and prints the URLs. It also runs EE, runs either edition from a Docker image, checks out branches before starting, tails logs, and stops instances gracefully or hard.

By hand, every time:

```bash
cd ~/dev/kestra
docker start kestra-postgres-1
# is port 8080 free? does Vite still proxy to :8080, frontend on :5173?
cd ui && npm install && npm run dev &
./gradlew :cli:runLocalPostgres --init-script ... --no-daemon &
# now wait, and guess when it is actually ready
```

With the script:

```bash
kestra-core-run                 # OSS from local source
kestra-core-run --ee            # EE stack
kestra-core-run --docker        # OSS from a Docker image (ephemeral H2)
kestra-core-run -b develop      # checkout, pull, then start
kestra-core-run status          # what is running, with URLs
kestra-core-run restart         # kill everything and restart
```

Docker instances can run side by side on separate ports, so you can compare two versions at once. When a Gradle build fails, the script prints the actual compiler `error:` lines inline instead of leaving you to grep the log. Small thing, saves a minute every time.

Once you have edited plugin source, `kestra-plugin-shadowjar` builds the shadow JAR and deploys it into your plugins directory under Kestra's artifact naming convention. Multi-module plugins produce one JAR per submodule, and the script handles all of them, cleans out stale versions, and can restart Kestra afterward.

By hand you would run:

```bash
cd ~/dev/plugin-kafka && ./gradlew shadowJar
# find the right jar in build/libs (not -sources, not -javadoc)
rm ~/dev/plugins/plugin-kafka-*.jar
cp build/libs/plugin-kafka-1.x.y-SNAPSHOT.jar ~/dev/plugins/
# then restart Kestra so it picks the jar up
```

With the script:

```bash
kestra-plugin-shadowjar                          # fuzzy-select which plugins to build
kestra-plugin-shadowjar plugin-mqtt plugin-kafka # non-interactive, agent-friendly
kestra-plugin-shadowjar plugin-mqtt --restart-kestra
```

The two together are the tight edit-build-see loop: change code, `kestra-plugin-shadowjar plugin-x --restart-kestra`, refresh the browser.

## Fleet management across 200+ repos

Working against one repo is easy. Working against the whole org is where the scripts earn their keep.

`kestra-plugins-repositories-clone-missing` fetches the current list of `plugin-*`, `storage-*`, and `secret-*` repos from GitHub and clones whatever you are missing, skipping archived and template repos. Run it from your dev directory whenever the org has grown.

```bash
# By hand: open github.com/kestra-io, scroll 200+ repos,
# work out which ones you don't have, clone them one at a time.
cd ~/dev && kestra-plugins-repositories-clone-missing
```

`kestra-plugins-status` surveys local git state across every clone and groups the results: uncommitted changes, repos left on a feature branch, unpushed commits, repos behind `origin/main`. It is read-only unless you ask it to fetch first, and it answers "what is the state of my clones right now?" in about a second instead of 50 manual `git status` calls. Handy before a release session or after a week away.

```bash
# By hand: cd into each repo, git status, git log @{u}.., repeat 200+ times.
kestra-plugins-status
```

`kestra-plugins-pull` switches each repo to `main` and runs `git pull --ff-only`, skipping any repo with local changes so your work is never touched.

```bash
# By hand:
# cd ~/dev/plugin-aws  && git switch main && git pull
# cd ~/dev/plugin-gcp  && git switch main && git pull
# ... repeat 200 times
kestra-plugins-pull
```

`kestra-plugins-search` runs a ripgrep search across every clone in parallel and groups matches by repo, respecting `.gitignore` and defaulting to Java files. Finding every implementer of an interface across the fleet becomes one command instead of hand-assembling the path globs and flags each time:

```bash
# By hand:
rg -n "RunnableTask" ~/dev/plugin-*/ ~/dev/storage-*/ ~/dev/secret-*/

# With the script (parallel, grouped by repo, prompts for file type):
kestra-plugins-search "RunnableTask"
```

`kestra-plugin-scaffold` is the heaviest of the fleet tools. Bootstrapping a new plugin by hand means clicking "Use this template" on GitHub, cloning, running `sed` across a dozen files, moving package directories, deleting the example task, committing, and pushing. The script does all of it in one pass: it creates the repo from `kestra-io/plugin-template` if it does not exist, rewrites every placeholder to match the new name and OSS or EE conventions, deletes the scaffold classes, makes one clean commit, and asks before pushing. It knows the package and Gradle group conventions for each repo type, so `plugin-ee-*`, `storage-*`, and `secret-*` all land in the right namespace.

```bash
# By hand: Use this template on GitHub, name the repo, clone it,
# sed across a dozen files, move two package dirs, delete Example.java,
# edit devcontainer.json, commit, push.
kestra-plugin-scaffold   # one command, one clean first commit
```

`kestra-agents-update` keeps our AI tooling consistent. It symlinks each repo's `.claude` and `.opencode` directories back to our central `engineering-ai-hub`, so a single change to an agent or skill propagates to every plugin repo at once.

```bash
# By hand: ln -s in every repo, recompute relative paths,
# handle .git/info/exclude, redo it whenever the hub changes.
kestra-agents-update plugins   # wire up every plugin repo
```

## Shipping and tracking work

`kestra-plugin-release` is the most careful script in the repo, because releasing is where mistakes are expensive. It scans every plugin for unreleased commits in parallel (cached for 30 minutes), shows a badge next to each, and offers four modes: standard (pick a bump per plugin), batch (one bump for all), auto (bump inferred from conventional commit messages), and hotfix (cherry-pick onto an existing tag). It suggests the version bump from the commit history, checks whether a tag already exists before releasing, and derives the version from the last released tag rather than a possibly-stale local file.

It also carries a good deal of hard-won operational knowledge. It shuts down the Gradle daemons a release spawns so a batch run does not saturate RAM, and it handles a long-standing `gradlew.bat` line-ending quirk that otherwise breaks releases three different ways. That is exactly the kind of thing you do not want an agent (or a human) rediscovering under pressure.

```bash
# By hand, per plugin: check unreleased commits, pick a bump, verify
# the tag isn't already taken, git switch main, fast-forward,
# ./gradlew release..., then clean up the leaked Gradle daemons.
kestra-plugin-release
```

`kestra-plugins-release-list` audits which plugins shipped a release since, or between, chosen Kestra core versions, marks brand-new plugins, and can pull the feat/fix lines from each release body.

By hand this means opening each plugin repo's releases tab and eyeballing anything newer than the Kestra release date. With the script:

```bash
kestra-plugins-release-list 1.1        # everything since Kestra 1.1.0
kestra-plugins-release-list 1.1 1.2    # a range
kestra-plugins-release-list --notes    # with changelog highlights
```

Two dashboards cover incoming work. `kestra-plugins-issues` searches open issues org-wide and loads them into a filterable table (by status, assignee, `kind/*` label, or release), then opens the one you pick in the browser. `kestra-plugins-prs` does the same for pull requests, showing CI status, review state, and age in one table, sorted so failing CI and changes-requested reviews float to the top.

```bash
# By hand: open each repo's Issues (or Pull requests) tab, juggle
# the same search filters, scroll, repeat across 200+ repos.
kestra-plugins-issues
kestra-plugins-prs
```

`kestra-plugins-merge-dependabot-prs` is the one that saves the most wall-clock time. It walks every repo, checks CI on each open Dependabot PR, and acts: approve and squash-merge the green ones, post `@dependabot rebase` on conflicts, and, for the common case of a red Gradle-wrapper bump caused by line endings, renormalize and push the fix so CI can go green. A `--dry-run` flag previews the whole plan before anything happens.

```bash
# By hand: open 200+ repos, find each Dependabot PR, check CI,
# approve, merge (or fix the red one)... dozens of times.
kestra-plugins-merge-dependabot-prs --dry-run   # preview
kestra-plugins-merge-dependabot-prs             # merge everything green
```

## Measuring API coverage

Two scripts answer a question we kept asking informally: how complete are our clients against the live API? They derive the 100% from the actual Micronaut controllers in the OSS and EE backends at a given ref, not from an OpenAPI spec, then match what each client implements.

`kestra-sdk-api-coverage` reports coverage for the hand-written Python, Go, and Java SDKs and lists the biggest gaps by resource. `kestra-kestractl-api-coverage` does the same for the kestractl CLI, resolving CLI calls through the generated Go SDK, and surfaces "quick wins": endpoints the SDK already exposes that the CLI has not wrapped yet. Both write a JSON report with `--json` for anything downstream that wants to consume the numbers.

```bash
# By hand: read every backend controller, list its routes, grep each
# SDK (or trace each CLI command through the Go SDK) for matches.
# No real number at the end, just a guess.
kestra-sdk-api-coverage
kestra-kestractl-api-coverage
```

## The bookends of the day

`kestra-recap` fetches everything you touched across the kestra-io org on your last working day (yesterday, or the previous Friday on a Monday), groups it by repo, collapses cross-repo work into a single line, and prints a Slack-ready standup block. Paste it, fill in the "Today" section, done.

```bash
# By hand: filter GitHub by your username, copy PR titles and URLs
# one by one, format the Slack message from memory.
kestra-recap
```

`kestra-laptop-setup` is the newcomer's first command. It is a guided, idempotent installer for a full Kestra dev machine on Ubuntu or macOS: shell, JDKs, Node, Go, Docker, the cloud CLIs, IDEs, SSH keys, and the plugin clones. Every section detects what is already present and skips it, so re-running it to add one tool is safe.

```bash
# By hand: remember 15+ tools, each install method, each config
# location, and every macOS vs Ubuntu difference, in the right order.
kestra-laptop-setup
```

## Why this shape works

The pattern that keeps paying off is that a script is a shared contract between a human and an agent. When we teach the squad a new command, the agents get it for free, because the same binary is on the same PATH and the Bash tool calls it the same way. When we fix a sharp edge once (the daemon leak, the wrapper line endings, the duplicate-tag check), the fix lives in one versioned place, and neither a teammate nor an agent has to relearn it.

We did not set out to build an agent framework. We set out to stop typing the same fifteen commands, and it turned out the scripts that made us faster made the agents faster too, for the same reason: the knowledge is written down once, and running it costs almost nothing.
