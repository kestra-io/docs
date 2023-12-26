---
title: Namespace Page (EE)
---

::alert{type="warning"}
This is an [Enterprise Edition](https://kestra.io/enterprise) feature.
::

When first accessing the **Namespace** page, you will see the list of all Kestra flow namespaces (including parents, as namespaces are hierarchical like a directory tree), but you will not be able to configure a namespace before creating it.

![Kestra User Interface Home Page](/docs/user-interface-guide/14-EE-Namespace.png)

You can click on the **+** icon at the right of a namespace to create it.

![Kestra User Interface Home Page](/docs/user-interface-guide/15-EE-Namespace-Create.png)

After creating a namespace, you can configure it:
- The **Variables** tab allows setting variables scoped to a namespace.
- The **Task defaults** tab allows setting task default scoped to a namespace.
- The **Secrets** tab allows setting secrets accessible via the [secret function](../05.developer-guide/03.variables/04.function/secret.md).
- The **Groups**, **Roles**, and **Access** tabs allow managing role-based access control.
- The **Service accounts** tab allows managing service accounts to access Kestra as a service, and not as an end user.
- The **Audit Logs** tab allows access to the audit logs of the namespace.

![Kestra User Interface Home Page](/docs/user-interface-guide/16-EE-Namespace-Configure.png)
