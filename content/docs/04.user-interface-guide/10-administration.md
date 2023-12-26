---
title: Administration Page
---

## Users Page (EE)

::alert{type="warning"}
This is an [Enterprise Edition](https://kestra.io/enterprise) feature.
::

On the **Users** page, you will see the list of users.

By clicking on a user id or on the eye icon, you can open the page of a user.

![Kestra User Interface Home Page](/docs/user-interface-guide/17-EE-Users.png)

The **Create** button allows creating a new user and managing that user's access to Kestra.

![Kestra User Interface Home Page](/docs/user-interface-guide/18-EE-Users-Create.png)

Users can be attached to Groups and/or Namespaces.

## Groups Page (EE)

::alert{type="warning"}
This is an [Enterprise Edition](https://kestra.io/enterprise) feature.
::

On the **Groups** page, you will see the list of groups.

By clicking on a group id or on the eye icon, you can open the page of a group.

![Kestra User Interface Home Page](/docs/user-interface-guide/19-EE-Groups.png)

The **Create** button allows creating a new group and managing its access to Kestra.

![Kestra User Interface Home Page](/docs/user-interface-guide/20-EE-Groups-Access.png)


It's a collection of users who require the same set of permissions. It's useful to assign the same permissions to multiple users who belong to the same team or project.


## Roles Page (EE)


::alert{type="warning"}
This is an [Enterprise Edition](https://kestra.io/enterprise) feature.
::

On the **Roles** page, you will see the list of roles.

By clicking on a role id or on the eye icon, you can open the page of a role.

![Kestra User Interface Home Page](/docs/user-interface-guide/21-EE-Roles.png)

The **Create** button allows creating a new role.

![Kestra User Interface Home Page](/docs/user-interface-guide/22-EE-Roles-Create.png)


Roles manage CRUD (CREATE, READ, UPDATE, DELETE) access to Kestra resources such as flows, executions, or secrets. They can be attached to groups or users.

![Kestra Roles Crud](/docs/user-interface-guide/32-EE-Roles-CRUD.png)

## Triggers Page

On the **Triggers** page, you can see an overview of the various triggers of your instance and troubleshooting capabilities.

![Kestra User Interface Trigger](/docs/user-interface-guide/31-Administration-Triggers.png)


## Workers Page

On the **Workers** page, you will see the list of available [workers](/docs/architecture#worker) and [worker groups](/docs/architecture#worker-group-ee).

![Kestra User Interface Worker Groups](/docs/user-interface-guide/30-Administration-Workers.png)
