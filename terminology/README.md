# Terminology

This section describe some specific terms usage for kestra system. It aims to make it simpler to understand the system for newcomers.

## Kestra versions

There are two kestra versions.

**Community Edition** : Also called as CE or Kestra Core, this is the open source version for Kestra which [sources are distributed on Github](https://github.com/kestra-io/kestra) and builds are available via [Kestra on dockerhub](https://hub.docker.com/r/kestra/kestra). This version contains all core features described in this documentation and is extensible with the [plugin system](/plugins)

**Enterprise Edition** : There are more features for the enterprise edition tailored for enterprise usages. This is mainly some features handled by the plugin system that adds some extra features .

## Flow

A flow is a task set description for kestra. It defines the kestra's computational behavior when it is interpreted.

## Execution

An execution is a flow that is currently processing or have already finished doing things. It is a task set processing together to acheive the flow goal that is to be ran successfully.

## Task

This is a description of some computation. There are many tasks types that can be some command line execution or some database operations.