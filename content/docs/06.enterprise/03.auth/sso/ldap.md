---
title: LDAP
icon: /docs/icons/tutorial.svg
editions: ["EE"]
version: "0.22.0"
---

Enable LDAP authentication in Kestra to streamline authentication using existing LDAP credentials.

## What is LDAP

Lightweight directory access protocol (LDAP) allows applications to quickly query user information. Organizations store usernames, passwords, email addresses, and other static data within directories. LDAP is an open, vendor-neutral application protocol for accessing and maintaining that data.

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

With LDAP configured, when a user logs into Kestra for the first time, their login attributes are checked against the LDAP directory, and a user is created in Kestra. If Kestra finds an existing, matching account, the user is logged into Kestra with the LDAP account. 

If they are a part of any groups specified in the directory, those groups will be added to Kestra. If the group already exists in Kestra, they will be automatically added. If a user is added to a group after already logging into Kestra once, that user must logout and log back into Kestra as the LDAP server only syncs at the point of logging in. Any user authenticated through LDAP will show `LDAP` as their Authentication method in the **IAM - Users** tab in Kestra.

![ldap-1](/docs/enterprise/sso/ldap-1.png)

Any updates to a user and their group access on the LDAP server will update in Kestra at the next synchronization (typically at the next login).

::alert{type="warning"}
If a user is deleted from the LDAP server, then that user will lose access to Kestra at the next scheduled sync or login attempt.
::