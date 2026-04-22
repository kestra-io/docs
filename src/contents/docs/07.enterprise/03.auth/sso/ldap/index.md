---
title: "LDAP Authentication in Kestra: Directory Login"
h1: Connect Your LDAP Directory for User Login and Group Sync
description: Enable LDAP authentication in Kestra. Connect your existing LDAP directory to manage user login and group synchronization securely.
sidebarTitle: LDAP
icon: /src/contents/docs/icons/admin.svg
editions: ["EE"]
version: "0.22.0"
---

Enable LDAP authentication in Kestra to authenticate users against your existing directory and sync group memberships automatically.

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/lGdoZf2SZrE?si=uPe9e-oO6e7NgKMM" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What is LDAP

Lightweight directory access protocol (LDAP) allows applications to quickly query user information. Organizations use directories to store usernames, passwords, email addresses, and other static data. LDAP is an open, vendor-neutral protocol for accessing and managing that data.

With Kestra, you can use an existing LDAP directory to authenticate users and sync them to groups with specific access permissions.

## Configuration

LDAP is configured under the security context of your [Kestra Security and Secrets configuration](../../../../configuration/05.security-and-secrets/index.md) file. 

[LDAP with Micronaut](https://micronaut-projects.github.io/micronaut-security/4.11.3/guide/#ldap) supports `context`, `search`, and `groups` as core configuration properties supported out of the box. These properties define the connection context, user attribute mapping, and group filtering needed to synchronize users and their group memberships with Kestra.

The `user-attributes` section maps LDAP attributes such as `givenName`, `sn`, and `mail` to the corresponding Kestra user properties (first name, last name, and email).

The examples below extend the base Micronaut LDAP configuration with these Kestra-specific mappings.

### Unix configuration

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

### Windows configuration

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
          server: "ldaps://<hostname>:636" # ldap://<hostname>:389 for non-TLS
          manager-dn: "CN=********,CN=Users,DC=domain,DC=local"
          manager-password: "********"
        search:
          base: "DC=domain,DC=local"
          filter: "(userPrincipalName={0})"
          attributes:
            - "sAMAccountName"
            - "givenName"
            - "sn"
            - "userPrincipalName"
        groups:
          enabled: true
          base: "DC=domain,DC=local"
          filter: "(&(objectClass=group)(member={0}))"
          filter-attribute: dn
```

Key points for Windows Active Directory:

- **Login format**: the `userPrincipalName` filter requires users to log in with their full UPN, e.g. `john@domain.local`. If your users expect to log in with just their short username (e.g. `john`), change the filter to `(sAMAccountName={0})` and update the `email` attribute mapping accordingly.
- **Search base**: setting `search.base` and `groups.base` to the root domain (`DC=domain,DC=local`) covers users and groups across all OUs. Narrow these to a specific OU (e.g. `OU=Engineering,DC=domain,DC=local`) if you want to restrict access to a subset of your directory.
- **Group filter attribute**: AD `member` attributes store full DNs, so `filter-attribute: dn` is required. Without it, Micronaut defaults to `cn` and group membership lookups will silently return no results.
- **TLS**: use `ldaps://` on port 636 in production. Plain `ldap://` on port 389 sends credentials in cleartext. If your AD uses a self-signed certificate, you must add it to the JVM truststore or configure certificate trust in your Kestra deployment.

#### Finding Windows Active Directory values

Use the following PowerShell commands on your Windows domain controller to look up the values needed for the configuration above.

**LDAP server hostname** (`context.server`)

```powershell
(Get-ADDomainController).HostName
```

Use the returned hostname as `ldaps://<hostname>:636` for TLS or `ldap://<hostname>:389` for non-TLS.

**Manager DN** (`context.manager-dn`)

```powershell
([adsisearcher]"(sAMAccountName=Administrator)").FindOne().Properties.distinguishedname
```

Replace `Administrator` with the service account you intend to use as the bind user. The returned distinguished name (DN) is the value for `manager-dn`.

**User distinguished name**

To look up the DN of a specific user (useful for verifying your `search.base`):

```powershell
Get-ADUser -Identity "JohnDoe" | Select-Object Name, DistinguishedName
```

**Groups for a user**

To list the groups a user belongs to (useful for planning your `groups.base` and `groups.filter`):

```powershell
Get-ADPrincipalGroupMembership -Identity "JohnDoe" | Select-Object Name, DistinguishedName
```

**Members of a group**

To verify the members of a specific group:

```powershell
Get-ADGroupMember -Identity "CN=Auto,OU=Distro,OU=Groups,DC=kestra,DC=local" | Select-Object sAMAccountName, Name
```

Replace the identity string with the DN of your target group.

## LDAP users in Kestra

Once LDAP is configured, when a user logs into Kestra for the first time, their credentials are validated against the LDAP directory, and a corresponding user is created in Kestra. If a matching account already exists in Kestra, the user is authenticated using their LDAP credentials.

If they are a part of any groups specified in the directory, those groups will be added to Kestra. If the group already exists in Kestra, they will be automatically added. If a user is added to a group after their initial login, they must log out and log back in for the new group assignment to sync, as synchronization occurs only at login. Any user authenticated via LDAP will show `LDAP` as their Authentication method in the **IAM - Users** tab in Kestra.

![IAM Users tab showing LDAP as the authentication method for a user](./ldap-1.png)

Any updates to a user and their group access on the LDAP server will update in Kestra at the next synchronization (typically at the next login).

:::alert{type="warning"}
If a user is deleted from the LDAP server, they will lose access to Kestra at the next synchronization or login attempt.
:::
