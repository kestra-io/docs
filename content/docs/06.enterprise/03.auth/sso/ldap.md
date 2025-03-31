---
title: LDAP
icon: /docs/icons/tutorial.svg
editions: ["EE"]
version: "0.22.0"
---

Enable LDAP authentication in Kestra to streamline authentication using existing LDAP credentials.

## What is LDAP

Lightweight directory access protocol (LDAP) is a protocol that makes it possible for applications to quickly query user information. Organization store usernames, passwords, email addresses, and other static data within directories. LDAP is an open, vendor-neutral application protocol for accessing and maintaining that data.

With Kestra, you can use an existing LDAP directory to authenticate users and sync them to groups with specific access permissions.

## Configuration

LDAP is configured in the security context of your Kestra configuration file. Below is an example configuration with Kestra-specific properties on top of the Micronaut configuration.

```yaml
security:
  ldap:
    default:
      user-attributes:
        firstName: firstNameAttribute
        lastName: lastNameAttribute
        email: mailAttribute
      context:
        server: "ldap://localhost"
        manager-dn: "cn=admin,dc=example,dc=org"
        manager-password: "LDAP_PASSWORD"
      search:
        base: "dc=example,dc=org"
        attributes:
          - "uid"
          - "firstNameAttribute"
          - "lastNameAttribute"
          - "mailAttribute"
      groups:
        enabled: true
        base: "dc=example,dc=org"
        filter: "{&(objectClass=posixGroup)(memberUid={0})}"
        filter-attribute: uid
```

[LDAP with Micronaut](https://micronaut-projects.github.io/micronaut-security/4.11.3/guide/#ldap) has `context`, `search`, and `groups` as basic configuration properties supported out of the box. They provide the connection context to the directory of users, user attributes to be linked to the Kestra instance, and filter information to sync the users' groups to Kestra based on your LDAP directory. 

For Kestra-specific configuration, `user-attributes` is the key property that links the attributes on the LDAP side to the attributes on the Kestra side. In this configuration, user attributes like First Name, Last Name, and Email are mapped between the two.

## LDAP users in Kestra

With LDAP configured, when a user logs into Kestra for the first time, their login attributes will be checked against the LDAP directory and a user will be created in Kestra. If Kestra finds an already existing matching account, then the user will be logged into Kestra with the LDAP account. 

If they are a part of any groups specified in the directory, those groups will be added to Kestra, and if the group already exists in Kestra, then they will be added automatically. Any user authenticated through LDAP, will show `LDAP` as their Authentication method in the **IAM - Users** tab in Kestra.

![ldap-1](/docs/enterprise/sso/ldap-1.png)

Any updates to a user and their group access on the LDAP server will update in Kestra at the next synchronization (typically at the next login).

::alert{type="warning"}
If a user is deleted from the LDAP server, then that user will lose access to Kestra at the next scheduled sync or whenever the user next attempts to log in.
::