"""
Fetch issue + PR context directly from GitHub, then call Gemini for docs assessment.
All user-generated content (issue body, PR description, source code) is fetched
here rather than passed through Kestra's Pebble rendering.
"""
import json, os, pathlib, urllib.request, base64
from kestra import Kestra

API_KEY    = os.environ["GEMINI_API_KEY"]
GH_TOKEN   = os.environ["GITHUB_TOKEN"]
MODEL      = "gemini-2.5-flash"

ISSUE_URL    = os.environ.get("ISSUE_URL", "")
REPO_OWNER   = os.environ.get("REPO_OWNER", "")
REPO_NAME    = os.environ.get("REPO_NAME", "")
RELEASE      = os.environ.get("RELEASE", "unset")
PR_NUMBER    = os.environ.get("PR_NUMBER", "")
PR_REPO_OWNER = os.environ.get("PR_REPO_OWNER", REPO_OWNER)
PR_REPO_NAME  = os.environ.get("PR_REPO_NAME", REPO_NAME)

GH_HEADERS = {
    "Authorization": f"Bearer {GH_TOKEN}",
    "Accept": "application/vnd.github+json",
    "User-Agent": "kestra-flows-docs",
}

def gh_get(url):
    req = urllib.request.Request(url, headers=GH_HEADERS)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def gemini(system, user, json_mode=False):
    url  = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"parts": [{"text": user}], "role": "user"}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 2048},
    }
    if json_mode:
        body["generationConfig"]["responseMimeType"] = "application/json"
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"]

# ── Fetch issue ───────────────────────────────────────────────────────────────
issue_number_str = ISSUE_URL.rstrip("/").split("/")[-1] if ISSUE_URL else ""
try:
    issue = gh_get(f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{issue_number_str}")
    title  = issue.get("title", "Unknown")
    body   = issue.get("body", "") or ""
    labels = [l["name"] for l in issue.get("labels", [])]
except Exception as e:
    title, body, labels = "Unknown", f"[fetch error: {e}]", []

# ── Fetch PR if linked ────────────────────────────────────────────────────────
pr_title, pr_body, source_files = "", "", []
if PR_NUMBER:
    try:
        pr = gh_get(f"https://api.github.com/repos/{PR_REPO_OWNER}/{PR_REPO_NAME}/pulls/{PR_NUMBER}")
        pr_title = pr.get("title", "")
        pr_body  = pr.get("body", "") or ""
        head_sha = pr.get("head", {}).get("sha", "")

        files_resp = gh_get(
            f"https://api.github.com/repos/{PR_REPO_OWNER}/{PR_REPO_NAME}/pulls/{PR_NUMBER}/files?per_page=100"
        )
        SKIP = (".sum", ".lock", "_test.go", "-lock.json", ".snap", ".pb.go", ".mod")
        MAX  = 15_000
        for f in files_resp:
            path = f["filename"]
            if any(path.endswith(s) for s in SKIP) or f.get("status") == "removed":
                continue
            try:
                fc = gh_get(
                    f"https://api.github.com/repos/{PR_REPO_OWNER}/{PR_REPO_NAME}/contents/{path}?ref={head_sha}"
                )
                content = base64.b64decode(fc["content"]).decode("utf-8", errors="replace")
                source_files.append({
                    "path": path,
                    "status": f["status"],
                    "content": content[:MAX],
                    "truncated": len(content) > MAX,
                    "blob_url": f"https://github.com/{PR_REPO_OWNER}/{PR_REPO_NAME}/blob/{head_sha}/{path}",
                })
            except Exception:
                pass
    except Exception as e:
        pr_body = f"[PR fetch error: {e}]"

# ── Build prompt ──────────────────────────────────────────────────────────────
parts = [
    "## Issue",
    f"Title: {title}",
    f"URL: {ISSUE_URL}",
    f"Repo: {REPO_OWNER}/{REPO_NAME}",
    f"Release: {RELEASE}",
    f"Labels: {', '.join(labels) or 'none'}",
    "",
    body or "(no body)",
]
if pr_title:
    parts += ["", "## Linked PR", f"Title: {pr_title}", f"Body: {pr_body or '(no description)'}"]
    if source_files:
        parts.append("\n## Source files changed")
        for f in source_files:
            parts.append(f"\n### {f['path']} ({f['status']})\n{f.get('blob_url','')}")
            parts.append(f"```\n{f.get('content','')}\n```")
            if f.get("truncated"):
                parts.append("[truncated]")
else:
    parts.append("\nNo linked PR — assess from issue body alone.")

SYSTEM = """You are a documentation impact assessor for Kestra.
Assess whether a closed GitHub issue and its merged PR require user-facing documentation work.
Return valid JSON only, no commentary, no markdown fences.

Return a JSON object with exactly these string fields:
- docs_required: one of "required", "likely", "optional", "not needed"
- user_impact: 1-2 sentence summary
- affected_audience: pipe-separated e.g. "users|operators"
- doc_types: pipe-separated e.g. "existing page update|reference update"
- candidate_paths: pipe-separated paths e.g. "src/contents/docs/05.workflow-components/index.md"
- reasoning: pipe-separated reasoning points
- gaps_or_unknowns: pipe-separated or "none"
- new_page_needed: "true" or "false"

High-signal for docs: new user-visible feature, changed defaults, new CLI commands,
new plugin properties, changed API shapes, EE/Cloud-specific changes, upgrade behavior.
Low-signal: internal refactors, test-only, dependency bumps."""

raw = gemini(SYSTEM, "\n".join(parts), json_mode=True)

try:
    assessment = json.loads(raw)
except json.JSONDecodeError:
    assessment = {
        "docs_required": "likely",
        "user_impact": "Could not parse assessment — manual review needed.",
        "affected_audience": "users",
        "doc_types": "existing page update",
        "candidate_paths": "src/contents/docs",
        "reasoning": "Gemini response was not valid JSON",
        "gaps_or_unknowns": raw[:200],
        "new_page_needed": "false",
    }

# Also persist source_files for generate step
pathlib.Path("source_files.json").write_text(json.dumps(source_files))
pathlib.Path("pr_info.json").write_text(json.dumps({
    "pr_title": pr_title,
    "pr_body": pr_body,
    "pr_repo_owner": PR_REPO_OWNER,
    "pr_repo_name": PR_REPO_NAME,
    "pr_number": PR_NUMBER,
}))

Kestra.outputs({
    "docs_required":     str(assessment.get("docs_required", "likely")),
    "user_impact":       str(assessment.get("user_impact", "")),
    "affected_audience": str(assessment.get("affected_audience", "")),
    "doc_types":         str(assessment.get("doc_types", "")),
    "candidate_paths":   str(assessment.get("candidate_paths", "src/contents/docs")),
    "reasoning":         str(assessment.get("reasoning", "")),
    "gaps_or_unknowns":  str(assessment.get("gaps_or_unknowns", "none")),
    "new_page_needed":   str(assessment.get("new_page_needed", "false")),
})
