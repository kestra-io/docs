---
title: Configure LDAP Authentication for Kestra
description: Enable LDAP authentication in Kestra. Connect your existing LDAP directory to manage user login and group synchronization securely.
sidebarTitle: LDAP
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: "0.22.0"
---

Enable LDAP authentication in Kestra to streamline access using existing LDAP credentials.

## Configure LDAP authentication

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/lGdoZf2SZrE?si=uPe9e-oO6e7NgKMM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What is LDAP

Lightweight directory access protocol (LDAP) allows applications to quickly query user information. Organizations use directories to store usernames, passwords, email addresses, and other static data. LDAP is an open, vendor-neutral protocol for accessing and managing that data.

With Kestra, you can use an existing LDAP directory to authenticate users and sync them to groups with specific access permissions.

## Configuration

LDAP is configured under the security context of your [Kestra configuration](../../../../configuration/index.md) file. 

[LDAP with Micronaut](https://micronaut-projects.github.io/micronaut-security/4.11.3/guide/#ldap) supports `context`, `search`, and `groups` as core configuration properties supported out of the box. These properties define the connection context, user attribute mapping, and group filtering needed to synchronize users and their group memberships with Kestra.

For Kestra-specific configuration, the `user-attributes` section maps specific LDAP attributes such as `cn`, `givenName`, `sn`, and `mail` to the corresponding Kestra user properties. In this configuration, user attributes like First Name, Last Name, and Email are mapped between the two.

Below are example configurations with Kestra-specific properties on top of the Micronaut configuration.

### Unix Configuration

Below is an example Unix configuration:

```yaml
micronaut:
  security:
    ldap:
      default:
        user-attributes:
          firstName: givenName
          lastName: sn
          email: mail
        context:
          server: "ldap://localhost:389"
          manager-dn: "cn=admin,dc=example,dc=org"
          manager-password: "LDAP_ADMIN_PASSWORD"
        search:
          base: "ou=users,dc=example,dc=org"
          filter: "(mail={0})"
          attributes:
            - "uid"
            - "givenName"
            - "sn"
            - "mail"
        groups:
          enabled: true
          base: "ou=groups,dc=example,dc=org"
          filter: "{&(objectClass=posixGroup)(memberUid={0})}"
          filter-attribute: uid
```

### Windows Configuration

Below is an example configuration for Windows LDAP:

```yaml
micronaut:
  security:
    ldap:
      default:
        enabled: true
        user-attributes:
          firstName: givenName
          lastName: sn
          email: userPrincipalName
        context:
          server: "ldap://********" # Consider ldaps:// for production
          manager-dn: "CN=********,CN=Users,DC=domain,DC=local"
          manager-password: "********"
        search:
          base: "CN=Users,DC=domain,DC=local"
          filter: "(userPrincipalName={0})" 
          attributes:
            - "sAMAccountName"
            - "givenName"
            - "sn"
            - "userPrincipalName"
        groups:
          enabled: true
          base: "CN=Users,DC=domain,DC=local"
          filter: "(&(objectClass=group)(member={0}))"
```

## LDAP users in Kestra

Once LDAP is configured, when a user logs into Kestra for the first time, their credentials are validated against the LDAP directory, and a corresponding user is created in Kestra. If a matching account already exists in Kestra, the user is authenticated using their LDAP credentials.

If they are a part of any groups specified in the directory, those groups will be added to Kestra. If the group already exists in Kestra, they will be automatically added. If a user is added to a group after their initial login, they must log out and log back in for the new group assignment to sync, as synchronization occurs only at login. Any user authenticated via LDAP will show `LDAP` as their Authentication method in the **IAM - Users** tab in Kestra.

![ldap-1](./ldap-1.png)

Any updates to a user and their group access on the LDAP server will update in Kestra at the next synchronization (typically at the next login).

:::alert{type="warning"}
If a user is deleted from the LDAP server, they will lose access to Kestra at the next synchronization or login attempt.
:::
