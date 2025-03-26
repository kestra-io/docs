---
title: LDAP
icon: /docs/icons/tutorial.svg
editions: ["EE"]
---

Enable LDAP authentication in Kestra to improve security and streamline user access using existing LDAP credentials.

## What is LDAP

Lightweight directory access protocol (LDAP) is a protocol that makes it possible for applications to quickly query user information. Organization store usernames, passwords, email addresses, and other static data within directories. LDAP is an open, vendor-neutral application protocol for accessing and maintaining that data.

With Kestra, you can use an existing LDAP directory to authenticate users and sync them to groups with specific access permissions.

## Configuration

YAML Example (TBD)

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