import json, os, urllib.request
from kestra import Kestra

token      = os.environ["GITHUB_TOKEN"]
project_id = os.environ["PROJECT_ID"]
manual_url = os.environ.get("MANUAL_URL", "").strip()
force_run  = os.environ.get("FORCE_RUN", "false").lower() == "true"

HEADERS = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
    "User-Agent": "kestra-flows-docs",
}

def gql(query, variables):
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=body, headers=HEADERS, method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def build_item(c):
    fv = c.get("issueFieldValues", {}).get("nodes", [])
    release = next(
        (n["name"] for n in fv if n.get("field", {}).get("name") == "Release"),
        None
    )
    return {
        "issue_id": c["id"],
        "issue_url": c["url"],
        "issue_number": c["number"],
        "issue_title": c["title"],
        "repo_owner": c["repository"]["owner"]["login"],
        "repo_name": c["repository"]["name"],
        "release": release,
        "linked_prs": c.get("closedByPullRequestsReferences", {}).get("nodes", []),
    }

ISSUE_FIELDS = """
  id number title state url
  repository { name owner { login } }
  closedByPullRequestsReferences(first: 3) {
    nodes { number url repository { name owner { login } } }
  }
  issueFieldValues(first: 30) {
    nodes {
      __typename
      ... on IssueFieldSingleSelectValue {
        name
        field { ... on IssueFieldSingleSelect { name } }
      }
    }
  }
"""

# ── Manual single-issue path ─────────────────────────────────────────────────
if manual_url:
    data = gql(
        f"query($url:URI!){{ resource(url:$url){{ ... on Issue {{ {ISSUE_FIELDS} }} }} }}",
        {"url": manual_url}
    )
    c = data["data"]["resource"]
    if not c:
        raise ValueError(f"Could not resolve issue URL: {manual_url}")
    if c.get("state") != "CLOSED":
        raise ValueError(f"Issue is not CLOSED (state={c.get('state')}): {manual_url}")
    fv = c.get("issueFieldValues", {}).get("nodes", [])
    already_set = any(n.get("field", {}).get("name") == "Doc Status" for n in fv)
    if already_set and not force_run:
        print(f"Doc Status already set — skipping (use force_run=true to reprocess)")
        Kestra.outputs({"count": 0, "items": "[]"})
    else:
        Kestra.outputs({"count": 1, "items": json.dumps([build_item(c)])})

# ── Scheduled poll path ──────────────────────────────────────────────────────
else:
    POLL_QUERY = """
    query($projectId: ID!, $cursor: String) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items(first: 100, after: $cursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id
              content {
                __typename
                ... on Issue {
                  """ + ISSUE_FIELDS + """
                }
              }
            }
          }
        }
      }
    }
    """
    items, cursor, has_next = [], None, True
    while has_next:
        data = gql(POLL_QUERY, {"projectId": project_id, "cursor": cursor})
        page = data["data"]["node"]["items"]
        for node in page["nodes"]:
            c = node.get("content", {})
            if c.get("__typename") != "Issue" or c.get("state") != "CLOSED":
                continue
            fv = c.get("issueFieldValues", {}).get("nodes", [])
            if any(n.get("field", {}).get("name") == "Doc Status" for n in fv):
                continue
            items.append(build_item(c))
        has_next = page["pageInfo"]["hasNextPage"]
        cursor = page["pageInfo"]["endCursor"] if has_next else None

    Kestra.outputs({"count": len(items), "items": json.dumps(items)})
