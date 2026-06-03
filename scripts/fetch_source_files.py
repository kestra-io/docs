import json, os, base64, urllib.request
from kestra import Kestra

token  = os.environ["GITHUB_TOKEN"]
files  = json.loads(os.environ["PR_FILES"])
owner  = os.environ["REPO_OWNER"]
repo   = os.environ["REPO_NAME"]
sha    = os.environ["HEAD_SHA"]

HEADERS = {
    "Authorization": f"Bearer {token}",
    "User-Agent": "kestra-flows-docs",
    "Accept": "application/vnd.github+json",
}

SKIP = (".sum", ".lock", "_test.go", "-lock.json", ".snap", ".pb.go", ".mod")
MAX  = 15_000

results = []
for f in files:
    path = f["filename"]
    if any(path.endswith(s) for s in SKIP) or f.get("status") == "removed":
        continue
    try:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={sha}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        results.append({
            "path": path,
            "status": f["status"],
            "content": content[:MAX],
            "truncated": len(content) > MAX,
            "blob_url": f"https://github.com/{owner}/{repo}/blob/{sha}/{path}",
        })
    except Exception as e:
        results.append({
            "path": path, "status": f["status"],
            "content": f"[fetch error: {e}]", "blob_url": "",
        })

Kestra.outputs({"source_files": json.dumps(results)})
