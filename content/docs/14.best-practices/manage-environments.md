---
title: Manage Environments
icon: /docs/icons/best-practices.svg
---


Kestra users can manage their "environments" throught different levels of granularity. Kestra has three main concepts: instance, tenant, and namespace.

## When to use multiple instances?

An instance is a full deployment of Kestra. One best practice in Kestra is to have at least two separated instances: one for development and one for production.

The development serves as a "sandbox", only for development matters, while the production instance serves critical operations and is only accessible by administrators.

Large organizations have sometimes 3 or 4 environments: it's best to have Kestra Enterprise Edition to properly manage all these instances (thanks to improved governance, security and scalability provided by the Enterprise Edition of Kestra).


## When to use multiple tenants?

Tenants are logic separations of an instance. You can think of them as isolated Kestra projects using instance resources. One instance can have many tenants.

This is useful when the operation managed by Kestra serves different customers or teams. For example, a company with 10 customers would use tenants to separate each of them in Kestra. We can imagine the same in an international company, using Kestra tenants country-wise.
 
One can also use tenants to separate engineer environments within the same development instance.

Be aware that each tenant is using the same underlying instance resources. Therefore, it's not a best practice to use tenants to separate a development and a production environment. If the underlying instance is out of service for any reason, every tenant will be down too.

## When to use multiple namespaces?

Namespaces are great for managing your flows organizations. One can use namespaces to arrange projects by domain or team.

They can be used as "environments" for getting started and for open-source users who don't want to manage two or more instances. Again, it's not a best practice for critical operations as one development can crash the flow supporting "production".