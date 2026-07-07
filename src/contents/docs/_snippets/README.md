# Snippet library

Reusable content fragments for the Kestra docs. See [CONTENT_REUSE.md](../../../../CONTENT_REUSE.md)
for the full strategy: when to create a snippet, authoring rules, and review expectations.

Files in this directory are **not** pages — they carry no frontmatter and are excluded
from the docs content collection. They are included into pages with:

- `::snippet{name="<name>"}` for Markdown fragments (`<name>.md` in this directory)
- ` ```lang file=src/contents/docs/_snippets/<path> ``` ` for code files

Rules (short version — the strategy doc is authoritative):

1. Site-absolute links only (`/docs/enterprise`, never `../../07.enterprise/...`).
2. No page-specific context ("as shown above").
3. Whole self-contained blocks, not sentence fragments.
4. Update this catalog when you add, change, or retire a snippet.

## Catalog

| Snippet | Contents | Consumers |
|---|---|---|
| `terraform-resource-ee.md` | Info alert: this Terraform resource/data source is Enterprise-only | All EE-gated pages under `13.terraform/resources/` and `13.terraform/data-sources/` (24 pages) |
| `worker-groups-cloud.md` | Info alert: Worker Groups availability (EE yes, Cloud not yet) | `oss-vs-paid`, `07.enterprise/04.scalability/worker-group`, `08.architecture/02.server-components`, `task-runners/03.task-runners-vs-worker-groups`, `14.best-practices/8.business-unit-separation` |
| `install/ee-docker-login.md` | Info alert: EE private registry login + image names | `02.installation/02.docker`, `02.installation/03.docker-compose` |
| `install/docker-run.sh` | Canonical single-container `docker run` command | `01.quickstart`, `02.installation/02.docker` |
| `install/download-docker-compose.sh` | Command downloading the official `docker-compose.yml` | `02.installation/03.docker-compose`, `08.aws-ec2`, `09.gcp-vm`, `10.azure-vm`, `11.digitalocean-droplet`, `14.podman-compose` |
| `install/helm-install-kestra.sh` | Helm repo add/update + base `helm install` | `02.installation/04.kubernetes-aws-eks`, `05.kubernetes-gcp-gke`, `06.kubernetes-azure-aks` |
| `install/deployment-support.md` | Closing support paragraph: Slack + CI/CD guide pointers | All 7 VM and managed-Kubernetes install guides (`04`–`06`, `08`–`11` under `02.installation`) |
| `enterprise/scim-prerequisites.md` | Multi-tenancy prerequisite (config YAML + upgrade alert) for SCIM | `07.enterprise/03.auth/scim/{okta,keycloak,microsoft-entra-id,authentik}` |
| `enterprise/scim-setup-steps.md` | Kestra-side UI steps to create a SCIM provisioning integration | `07.enterprise/03.auth/scim/{okta,keycloak,microsoft-entra-id,authentik}` |
| `enterprise/scim-disable-note.md` | Behavior note: disabling/removing a SCIM integration | `07.enterprise/03.auth/scim/{okta,keycloak,microsoft-entra-id,authentik}` |
| `enterprise/scim-iam-role.md` | Auto-created `SCIMProvisioner` role/service account + why no USERS DELETE | `07.enterprise/03.auth/scim/{okta,keycloak,microsoft-entra-id,authentik}` |
| `cicd/readonly-label.md` | Info alert: set `system.readOnly` label on CI/CD-managed flows | `version-control-cicd/cicd` index + `{01.github-action,02.gitlab,03.terraform,05-azure-devops,06.bitbucket-pipes,07.kubernetes-operator}` |

When Worker Groups availability changes (e.g., Cloud support ships), edit
`worker-groups-cloud.md` once — all five consumer pages update at the next build.
