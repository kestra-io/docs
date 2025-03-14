---
title: LDAP
icon: /docs/icons/tutorial.svg
editions: ["EE"]
---

Enable LDAP authentication in Kestra to improve security and streamline user access using existing LDAP credentials.

## Configuration

YAML Example (TBD)

```yaml
micronaut:
  security:
    enabled: true
    ldap:
      default:
        enabled: true
        context:
          server: 'ldap://ldap.forumsys.com:389'
          managerDn: 'cn=read-only-admin,dc=example,dc=com'
          managerPassword: 'password'
        search:
          base: "dc=department,dc=team"
        groups:
          enabled: true
          base: "dc=department,dc=team"
```