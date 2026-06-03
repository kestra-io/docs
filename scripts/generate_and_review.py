"""
Generate and quality-check a docs proposal based on the assessment.
Reads source files written by assess.py (same WorkingDirectory),
fetches issue body directly from GitHub (never through Pebble rendering).
"""
import json, os, re, pathlib, urllib.request, base64  # noqa: F401 (base64 used below)
from kestra import Kestra

API_KEY   = os.environ["GEMINI_API_KEY"]
GH_TOKEN  = os.environ["GITHUB_TOKEN"]
MODEL     = "gemini-2.5-flash"

ISSUE_NUMBER  = os.environ["ISSUE_NUMBER"]
ISSUE_TITLE   = os.environ["ISSUE_TITLE"]
ISSUE_URL     = os.environ["ISSUE_URL"]
REPO_OWNER    = os.environ["REPO_OWNER"]
REPO_NAME     = os.environ["REPO_NAME"]
RELEASE       = os.environ.get("RELEASE", "2.0")
CANDIDATE_PATHS_STR = os.environ.get("CANDIDATE_PATHS", "src/contents/docs")
NEW_PAGE_STR  = os.environ.get("NEW_PAGE_NEEDED", "false")
USER_IMPACT   = os.environ.get("USER_IMPACT", "")
DOC_TYPES     = os.environ.get("DOC_TYPES", "")
PR_NUMBER     = os.environ.get("PR_NUMBER", "")
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

def gemini(system, user, max_tokens=4096):
    url  = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"parts": [{"text": user}], "role": "user"}],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": max_tokens},
    }
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"]

def parse_list(value):
    if not value or str(value).strip().lower() in ("", "none"):
        return []
    return [v.strip() for v in str(value).split("|") if v.strip()]

candidate_paths = parse_list(CANDIDATE_PATHS_STR)
new_page_needed = NEW_PAGE_STR.lower() == "true"

# ── Fetch issue body directly from GitHub ────────────────────────────────────
issue_number_str = ISSUE_URL.rstrip("/").split("/")[-1]
try:
    issue = gh_get(f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{issue_number_str}")
    issue_body = issue.get("body", "") or ""
except Exception:
    issue_body = ""

# ── Fetch PR info and source files directly from GitHub ───────────────────────
pr_title, pr_url, source_files = ISSUE_TITLE, "", []
if PR_NUMBER:
    try:
        pr = gh_get(f"https://api.github.com/repos/{PR_REPO_OWNER}/{PR_REPO_NAME}/pulls/{PR_NUMBER}")
        pr_title = pr.get("title", ISSUE_TITLE)
        pr_url   = f"https://github.com/{PR_REPO_OWNER}/{PR_REPO_NAME}/pull/{PR_NUMBER}"
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
        pr_title = ISSUE_TITLE

# ── Read existing docs ────────────────────────────────────────────────────────
existing = {}
for p in candidate_paths:
    try:
        existing[p] = pathlib.Path(p).read_text()
    except FileNotFoundError:
        existing[p] = None

source_ctx = "\n\n".join(
    f"### {f['path']} ({f['status']})\n{f.get('blob_url','')}\n```\n{f.get('content','')}\n```"
    + (" [truncated]" if f.get("truncated") else "")
    for f in source_files
) or "No source files available."

existing_ctx = "\n\n".join(
    f"### {p}\n```\n{c}\n```" if c else f"### {p} — NEW FILE"
    for p, c in existing.items()
) or "No existing docs found at candidate paths."

# ── Pass 1: Generate ──────────────────────────────────────────────────────────
draft = gemini(
    system="""You are a technical writer for Kestra (open-source workflow orchestration).
Generate documentation for a user-facing change.
RULES:
- Derive ALL content from the provided source code — never invent behavior
- Proper YAML frontmatter: title, description (and sidebarTitle if appropriate)
- Second person, active voice, present tense
- Include a working example derived directly from the source code
- Minimum viable scope — only what the change introduces or alters
- CLI commands: show subcommands, key flags, and a usage example
- Plugin changes: list key properties with types
- EE-only features: add an appropriate EE callout
- Output ONLY the raw markdown file content, no commentary""",
    user=f"""Generate documentation for this change.

Issue: {ISSUE_TITLE} ({ISSUE_URL})
Release: {RELEASE}
Assessment: {USER_IMPACT}
Doc types: {DOC_TYPES}
Target paths: {' | '.join(candidate_paths)}

Issue body:
{issue_body}

Source code:
{source_ctx}

Existing docs at target paths:
{existing_ctx}
""",
)

# ── Pass 2: Example snippet review ───────────────────────────────────────────
draft = gemini(
    system="""You are reviewing code examples in Kestra documentation.
RULES:
- Every example must match actual source code behavior exactly
- Fix any hallucinated flags, options, types, or field names
- Each example teaches one clear thing with minimal noise
- Mark unverifiable examples [UNVERIFIED] rather than silently removing them
- Output ONLY the corrected markdown file content, no commentary""",
    user=f"Review and fix examples against the source code.\n\nSource code:\n{source_ctx}\n\nDraft to review:\n{draft}",
)

# ── Pass 3: Style ─────────────────────────────────────────────────────────────
draft = gemini(
    system="""You are an editorial reviewer for Kestra docs.
RULES:
- Second person, active voice, present tense throughout
- First sentence: short, standalone, describes the topic directly
- Headings: sentence case, no trailing punctuation
- Remove filler ("Note that", "Simply", "It is worth noting")
- Alerts (:::alert) only for genuine warnings or required prerequisites
- Do not change technical meaning or invent product behavior
- Output ONLY the corrected markdown file content, no commentary""",
    user=draft,
)

# ── Pass 4: IA check (advisory) ───────────────────────────────────────────────
ia_notes = gemini(
    system="""You are an information architecture reviewer for Kestra docs.
Check placement and structure. Report ONLY real issues — say "OK" if correct.
Consider: correct section, no duplication, clear user goal, correct page type.""",
    user=f"Candidate paths: {' | '.join(candidate_paths)}\nExisting context: {existing_ctx[:2000]}\n\nDraft:\n{draft[:3000]}",
    max_tokens=512,
)

# ── Pass 5: Link fix ──────────────────────────────────────────────────────────
draft = gemini(
    system="""You are fixing links in a Kestra docs page.
RULES:
- Internal links must be relative, not absolute kestra.io URLs
- Links to other doc pages point to source files, not /docs/... routes
- Flag unverifiable links with [LINK?] rather than removing them
- Output ONLY the corrected markdown file content, no commentary""",
    user=draft,
)

# ── Write file ────────────────────────────────────────────────────────────────
if new_page_needed or not any(existing.values()):
    target = candidate_paths[0] if candidate_paths else f"src/contents/docs/{REPO_NAME}-{ISSUE_NUMBER}.md"
else:
    target = candidate_paths[0]

pathlib.Path(target).parent.mkdir(parents=True, exist_ok=True)
pathlib.Path(target).write_text(draft)

if new_page_needed:
    llms_path = pathlib.Path("public/llms.txt")
    if llms_path.exists():
        llms = llms_path.read_text()
        rel = target.replace("src/contents/docs/", "").replace("index.mdx", "").replace("index.md", "").rstrip("/")
        segments = [re.sub(r"^\d+\.", "", s) for s in rel.split("/")]
        doc_url = f"https://kestra.io/docs/{'/'.join(segments)}.md"
        llms_path.write_text(llms.rstrip() + "\n" + f"- {doc_url}: {ISSUE_TITLE}" + "\n")

# ── Build outputs ─────────────────────────────────────────────────────────────
slug   = re.sub(r"[^a-z0-9]+", "-", ISSUE_TITLE.lower())[:40].strip("-")
branch = f"docs/{REPO_NAME}-{ISSUE_NUMBER}-{slug}"
B      = "**"
src_pr_link  = f"[{pr_title}]({pr_url})" if pr_url else "N/A"
source_table = "\n".join(
    f"| [{f['path']}]({f.get('blob_url','')}) | {f['status'].upper()} |"
    for f in source_files
) or "| N/A | — |"
llms_line = "- [x] docs-llms-manager — llms.txt updated" if new_page_needed else ""

pr_body_text = "\n".join([
    "## Documentation proposal", "",
    f"{B}Source issue:{B} [{ISSUE_TITLE}]({ISSUE_URL})",
    f"{B}Source PR:{B} {src_pr_link}", "",
    "---", "", "## Assessment", "",
    f"{B}user_impact:{B} {USER_IMPACT}",
    f"{B}candidate_paths:{B} {' | '.join(candidate_paths)}", "",
    "---", "", "## Source files consulted", "",
    "| File | Change |", "|------|--------|", source_table, "",
    "---", "", "## Quality checks", "",
    "- [x] example-snippet-reviewer — examples verified against source",
    "- [x] docs-style-enforcer",
    f"- [x] docs-ia-reviewer (notes: {ia_notes.strip()[:300]})",
    "- [x] content-link-fixer", llms_line, "",
    "---", "*Auto-generated · verify examples against source before merging*",
])

Kestra.outputs({
    "branch_name": branch,
    "target_path": target,
    "pr_title": f"docs: {pr_title}",
    "pr_body": pr_body_text,
    "new_page": str(new_page_needed),
})
