---
title: LDAP and OIDC Group Sync Joins Existing Groups Only
h1: Create Your Identity Provider Groups in Kestra Before Users Log In
sidebarTitle: Group sync joins existing groups
icon: /src/contents/docs/icons/migration-guide.svg
release: 2.0.0
editions: ["EE"]
description: From 2.0.9, LDAP and OIDC logins no longer create groups in Kestra. Users join only the groups an administrator created with the same name, and LDAP creates a user only when a group, a default role, or an invitation gives them access.
---

From Kestra 2.0.9, LDAP and OIDC logins no longer create groups in Kestra. At each login, a user joins only the groups that an administrator created in Kestra with the same name as one of their identity provider groups. This change is not part of 1.3.

## What changed

Until 2.0.8, every group sent by LDAP or by the OIDC groups claim was created in every tenant, and the user was added to it. Since joining a group gives access to its tenant, users were given access to every tenant, through groups that had no role bound to them.

From 2.0.9:

- **Groups are never created at login.** The user joins every group, in every tenant, whose name matches a group sent by the identity provider. They leave the groups they joined through the identity provider and that it no longer sends. Group memberships added manually in Kestra are kept.
- **Leaving a group can remove tenant access.** When a user leaves the last group that gave them access to a tenant, they lose access to that tenant, unless they have a role bound to them directly, including through a default role, or are provisioned in that tenant by [SCIM](../../../07.enterprise/03.auth/scim/index.mdx).
- **A returning user without access is refused.** After group sync, a user who no longer has access to any tenant can't log in.
- **LDAP creates a user only when something gives them access.** At first login, Kestra creates the user only if one of their LDAP groups exists in Kestra, a tenant has a [default role](../../../configuration/05.security-and-secrets/index.md#default-role), or the user has a pending [invitation](../../../07.enterprise/03.auth/invitations/index.md). Otherwise the login is refused and no user is created. Until 2.0.8, LDAP created every user that logged in.
- **OIDC can create a user through a group.** Until 2.0.8, OIDC created a user only with a default role or an invitation. A group that exists in Kestra with the same name as one of the user's groups now also gives them access.

SCIM provisioning is not affected.

## What changes after upgrading

The groups created by earlier logins stay in Kestra, and their members keep them. Kestra cannot tell these groups apart from the groups an administrator created, so it does not delete them.

You need to act when:

- A new identity provider group must give access in Kestra: create the group first.
- A new tenant must receive users from an identity provider group: create the group in that tenant.
- LDAP users log in for the first time with no matching group, no default role and no invitation: they are now refused.

## Migration steps

1. List the groups your identity provider sends. In LDAP, they come from the `groups` configuration. In OIDC, they come from the claim set by `kestra.security.oidc.groups-claim-path`.
2. In each tenant that these users must access, create a group with the same name as the identity provider group, and bind it to the roles it needs (see [RBAC](../../../07.enterprise/03.auth/rbac/index.md)). The name must match the value the identity provider sends: Microsoft Entra ID, for example, sends group object IDs rather than names by default.
3. Delete the groups created by earlier logins in tenants where they are not needed, so that users no longer join them. Deleting a group removes its members, but not the tenant access they got through it: revoke that access from the users who must not keep it.
4. If LDAP users must be able to log in without a matching group, configure a default role or invite them before their first login.

## Related

- [LDAP](../../../07.enterprise/03.auth/sso/ldap/index.md)
- [SSO](../../../07.enterprise/03.auth/sso/index.md)
- [RBAC](../../../07.enterprise/03.auth/rbac/index.md)
