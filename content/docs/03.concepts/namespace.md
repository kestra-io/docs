---
title: Namespace
---

You can think of a namespace as a **folder for your flows**.

- Similar to folders on your file system, namespaces can be used to organize flows into logical categories.
- And as filesystems, namespaces can be indefinitely nested.
Using the dot `.` symbol, you can add hierarchical structure to your flow organization.
This allows to separate not only environments, but also projects, teams and departments.

This way, your **product, engineering, marketing, finance, and data teams** can all use the same Kestra instance, while keeping their flows organized and separated. They all can have their own namespaces that belong to a parent namespace indicating the **development** or **production** environment.

A namespace is like a folder for flows. A namespace is composed of words and letters separated by `.`. The hierarchy depth for namespaces is unlimited. Here are some examples of namespaces:
- `projectOne`
- `com.projectTwo`
- `test.projectThree.folder`

Namespaces are hierarchical, which means that for our previous example, the `test.projectThree.folder` namespace is inside the `test.projectThree` namespace.
