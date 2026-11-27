---
title: "15 Useful Python Automation Scripts (and the Best GitHub Repos for More)"
description: "The Python automation scripts that GitHub's most-starred script collections write most often, plus the production scripts they almost never include, with copy-paste code and how to run each one on a schedule with retries and alerts."
metaTitle: "15 Useful Python Automation Scripts + Top GitHub Repos"
metaDescription: "Copy-paste Python automation scripts for scraping, files, reports, and alerts, drawn from the most-starred GitHub script collections, and how to schedule them."
tag: "data"
date: 2026-11-26
slug: "python-automation-scripts"
faq:
  - question: "What are the most common Python automation scripts?"
    answer: "In the 13 most-starred collections of Python scripts on GitHub, the use cases that appear in the most repositories are price trackers (currency, crypto, stocks), web scrapers, image processing, PDF tools, CSV and Excel conversion, chat and messaging bots, email senders, news digests, file organizers, and duplicate file finders. Each appears in 7 to 11 of the 13 repositories."
  - question: "Where can I find useful Python scripts?"
    answer: "GitHub has several large collections. By stars, the biggest are geekcomputers/Python, trekhleb/learn-python, ndleah/python-mini-project, avinashkranjan/Amazing-Python-Scripts, larymak/Python-project-Scripts, and hastagAB/Awesome-Python-Scripts. Read any script before running it: many are community contributions with no tests and no maintenance."
  - question: "How do I run a Python script automatically every day?"
    answer: "On a single machine, use cron on Linux and macOS or Task Scheduler on Windows. When the script matters, run it from an orchestrator instead: you get retries, logs for every run, alerts on failure, secrets management, and the option to trigger it from an event such as a new file or a webhook rather than only from a clock."
  - question: "Can Kestra run my existing Python scripts?"
    answer: "Yes. Kestra runs Python code inline in a flow, from files stored in a namespace, or straight from a Git repository. Each script runs in its own container with its own dependencies, and Kestra adds scheduling, event triggers, retries, logs, and error handlers around it without changing the script."
  - question: "Is it safe to run Python scripts from GitHub?"
    answer: "Only after reading them. Check what the script imports, what it deletes or writes, which URLs it calls, and whether it asks for credentials. Pin package versions, run it first on test data, and keep secrets in environment variables or a secret manager rather than in the code."
---

> **TL;DR** — We pulled the file trees of the 13 most-starred collections of Python scripts on GitHub (about 2,400 scripts and mini projects) and grouped them by use case. This page gives you copy-paste versions of the ten automation use cases those collections write most often, from web scraping and price tracking to PDF, Excel, and email scripts. It adds five production scripts (uptime and SSL checks, backups, SQL exports, log triage) that the collections almost never include. Then it shows how to run any of them on a schedule with retries and alerts, and lists the repositories themselves, ranked by stars.

Most automation starts the same way: someone gets tired of doing a task by hand and writes forty lines of Python. The script works, so it gets a cron entry on a server, and a few months later nobody remembers where it runs or why it stopped.

Every script below is written to run unattended: it takes parameters, avoids interactive prompts, prints what it did, and fails loudly when something is wrong. Each one was run before publication. Package requirements are noted per script; everything else is in the Python standard library.

## What people automate with Python, according to GitHub

To pick the scripts, we downloaded the file trees of the 13 largest Python script collections on GitHub ([listed at the end of this page](#the-best-github-repositories-of-python-scripts)) and grouped their roughly 2,400 scripts and mini projects by use case, based on folder and file names. The counts are approximate, since a name does not always say what a script does, but the pattern is clear.

| Use case | Found in (of 13 repos) | Scripts |
|---|---|---|
| Currency, crypto, and stock prices | 11 | 44 |
| Web scraping | 10 | 138 |
| Image processing (convert, resize, compress) | 10 | 132 |
| Social media bots and scrapers | 10 | 71 |
| YouTube and video downloaders | 10 | 41 |
| PDF tools | 9 | 63 |
| Password generators and checkers | 9 | 51 |
| CSV and Excel conversion | 9 | 38 |
| Chat and messaging (Slack, Telegram, Discord, SMS) | 9 | 37 |
| URL shorteners | 9 | 13 |
| News and RSS | 8 | 36 |
| File organizers | 8 | 20 |
| QR codes | 8 | 19 |
| Sending emails | 8 | 15 |
| Duplicate file finders | 7 | 7 |
| Databases and SQL | 6 | 11 |
| Website and server monitoring | 4 | 8 |
| Backups | 3 | 4 |
| SSL certificate checks | 0 | 0 |
| Log parsing | 0 | 0 |

Two things stand out. First, a good share of the most popular scripts are one-off tools you run by hand (password and QR code generators, URL shorteners) or that break platform terms of service (video downloaders, social media bots). We left those out. Second, the scripts that keep production systems running are almost absent: no collection has an SSL certificate check or a log parser, and only three have a backup script.

So this page has two parts: the ten most common use cases that are worth automating, then five production scripts that the collections skip.

## 10 popular Python automation scripts

### 1. Track prices and alert on a threshold

Price trackers are the most widespread script in the collections (11 of 13 repos), whether for currencies, crypto, or stocks. This one reads prices from the public CoinGecko API and flags any coin that drops below a floor you set.

Requires: `requests`.

```python
import requests

# Alert when a price drops below the floor you set
WATCHLIST = {"bitcoin": 50_000, "ethereum": 2_000}

def check_prices(watchlist: dict[str, float]) -> list[str]:
    response = requests.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={"ids": ",".join(watchlist), "vs_currencies": "usd"},
        timeout=10,
    )
    response.raise_for_status()
    prices = response.json()
    alerts = []
    for coin, floor in watchlist.items():
        price = prices[coin]["usd"]
        print(f"{coin}: {price:,.2f} USD")
        if price < floor:
            alerts.append(f"{coin} is at {price:,.2f} USD, below {floor:,} USD")
    return alerts

if __name__ == "__main__":
    for alert in check_prices(WATCHLIST):
        print("ALERT:", alert)
```

**Automate it:** run it every hour and send the alerts to Slack with script 6. The [Python job scheduler guide](/resources/data/python-job-scheduler) has a full Kestra flow that values a crypto portfolio every morning from the same API.

### 2. Scrape a website to CSV

Web scraping is the largest category by volume (138 scripts across 10 repos). This scraper walks the paginated catalog of books.toscrape.com, a site built for scraping practice, and saves titles, prices, and stock status to CSV.

Requires: `requests`, `beautifulsoup4`.

```python
import csv
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

def scrape_books(start_url: str, pages: int = 3, path: str = "books.csv") -> None:
    rows, url = [], start_url
    for _ in range(pages):
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        for book in soup.select("article.product_pod"):
            rows.append({
                "title": book.h3.a["title"],
                "price": book.select_one(".price_color").text.strip(),
                "in_stock": "In stock" in book.select_one(".availability").text,
            })
        next_link = soup.select_one("li.next a")
        if not next_link:
            break
        url = urljoin(url, next_link["href"])
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["title", "price", "in_stock"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Saved {len(rows)} books to {path}")

if __name__ == "__main__":
    scrape_books("https://books.toscrape.com/")
```

Passing `response.content` rather than `response.text` lets BeautifulSoup detect the page encoding itself, which keeps characters like `£` intact. Before scraping a real site, check its terms of service and `robots.txt`, and keep the request rate low.

**Automate it:** run it daily and load the CSV into a database to track changes. For scraping at scale, the [Apify to Postgres blueprint](/blueprints/apify-scrape-to-postgres) runs a managed scraper on a schedule and bulk-loads the results.

### 3. Resize and compress images in bulk

Image scripts are the second-largest category (132 scripts across 10 repos). This one shrinks every image in a folder to a maximum width or height and re-encodes it as an optimized JPEG, which often cuts file size by more than half for web use.

Requires: `pillow`.

```python
from pathlib import Path
from PIL import Image

def optimize_images(folder: str, max_size: int = 1600, quality: int = 80) -> None:
    src = Path(folder).expanduser()
    out = src / "optimized"
    out.mkdir(exist_ok=True)
    for path in sorted(src.iterdir()):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        target = out / f"{path.stem}.jpg"
        with Image.open(path) as img:
            img.thumbnail((max_size, max_size))
            img.convert("RGB").save(target, "JPEG", quality=quality, optimize=True)
        print(f"{path.name}: {path.stat().st_size // 1024} KB -> {target.stat().st_size // 1024} KB")

if __name__ == "__main__":
    optimize_images("~/Pictures/to-publish")
```

`thumbnail()` keeps the aspect ratio and never enlarges an image. JPEG has no transparency, so transparent PNGs lose their alpha channel; save those as PNG or WebP instead.

**Automate it:** trigger it when new images land in a bucket. The [S3 trigger blueprint](/blueprints/s3-trigger-python) runs a Python script on every new file in an S3 prefix.

### 4. Extract text from PDFs

PDF tools appear in 9 of 13 repos: merging, splitting, converting images to PDF, and extracting text. Text extraction is the one worth automating, because it feeds search, indexing, and LLM steps. This script converts every PDF in a folder to a `.txt` file using `pypdf`, the maintained successor to PyPDF2.

Requires: `pypdf`.

```python
from pathlib import Path
from pypdf import PdfReader

def pdf_to_text(folder: str) -> None:
    for pdf in sorted(Path(folder).glob("*.pdf")):
        reader = PdfReader(pdf)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        pdf.with_suffix(".txt").write_text(text, encoding="utf-8")
        print(f"{pdf.name}: {len(reader.pages)} pages")

if __name__ == "__main__":
    pdf_to_text("invoices/")
```

Scanned PDFs contain images, not text, so `extract_text()` returns little or nothing for them. Those need an OCR step first.

**Automate it:** trigger it when a new PDF arrives in a bucket or an SFTP folder. Document workflows like this are covered in [file transfer automation](/resources/infrastructure/file-transfer-automation).

### 5. Merge CSV exports into one Excel report

CSV and Excel conversion shows up in 9 of 13 repos. This script takes every CSV in a folder and writes them into a single Excel workbook, one sheet per file, which replaces the weekly ritual of opening exports and copy-pasting tabs.

Requires: `pandas`, `openpyxl`.

```python
from pathlib import Path
import pandas as pd

def csvs_to_excel(folder: str, output: str = "report.xlsx") -> None:
    files = sorted(Path(folder).glob("*.csv"))
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        for csv_file in files:
            df = pd.read_csv(csv_file)
            df.to_excel(writer, sheet_name=csv_file.stem[:31], index=False)
    print(f"Wrote {len(files)} sheets to {output}")

if __name__ == "__main__":
    csvs_to_excel("exports/", "weekly-report.xlsx")
```

Excel limits sheet names to 31 characters, hence the `[:31]`.

**Automate it:** run it every Monday after the exports land, then email the workbook with script 7. In Kestra, the [serdes plugin](/plugins/plugin-serdes) converts CSV and query results to Excel without any Python.

### 6. Send a Slack notification

Messaging scripts (Slack, Telegram, Discord, SMS) appear in 9 of 13 repos. On its own, posting to Slack through an incoming webhook is trivial; combined with any other script on this page, it becomes the alerting layer.

Requires: `requests`.

```python
import os
import requests

def notify_slack(text: str) -> None:
    webhook = os.environ["SLACK_WEBHOOK_URL"]
    response = requests.post(webhook, json={"text": text}, timeout=10)
    response.raise_for_status()

if __name__ == "__main__":
    notify_slack("Nightly backup finished.")
```

Read the webhook URL from an environment variable or a secret manager. Anyone with the URL can post to your channel, so it does not belong in the code or in Git. To post a file rather than a message, see the [Slack attachment blueprint](/blueprints/send-slack-attachment).

### 7. Email a report with an attachment

Email senders appear in 8 of 13 repos. This version uses only the standard library: it builds the message with `EmailMessage`, attaches a file, and sends it over SMTP with TLS.

```python
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path

def send_report(to: str, subject: str, body: str, attachment: str | None = None) -> None:
    msg = EmailMessage()
    msg["From"] = os.environ["SMTP_USER"]
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if attachment:
        path = Path(attachment)
        msg.add_attachment(
            path.read_bytes(), maintype="application", subtype="octet-stream", filename=path.name
        )
    with smtplib.SMTP(os.environ["SMTP_HOST"], 587, timeout=30) as server:
        server.starttls()
        server.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
        server.send_message(msg)
    print(f"Sent '{subject}' to {to}")

if __name__ == "__main__":
    send_report("team@example.com", "Weekly report", "Report attached.", "weekly-report.xlsx")
```

Gmail and Microsoft 365 reject plain account passwords over SMTP; use an app password or a transactional email service.

**Automate it:** chain it after the report it sends, so the email only goes out when the report was built. The [email attachment blueprint](/blueprints/send-email-with-attachment) does the same with Kestra's email plugin.

### 8. Build a daily news digest from RSS feeds

News scrapers and RSS readers appear in 8 of 13 repos. Reading RSS feeds is more reliable than scraping news pages, since the format does not change with every site redesign. This script collects the latest entries from a list of feeds into one digest.

Requires: `feedparser`.

```python
import feedparser

FEEDS = {
    "Hacker News": "https://news.ycombinator.com/rss",
    "Planet Python": "https://planetpython.org/rss20.xml",
}

def build_digest(feeds: dict[str, str], per_feed: int = 5) -> str:
    lines = []
    for name, url in feeds.items():
        feed = feedparser.parse(url)
        if feed.bozo and not feed.entries:
            lines.append(f"{name}: feed unavailable ({feed.bozo_exception})")
            continue
        lines.append(f"{name}:")
        for entry in feed.entries[:per_feed]:
            lines.append(f"- {entry.title} ({entry.link})")
    return "\n".join(lines)

if __name__ == "__main__":
    print(build_digest(FEEDS))
```

`feedparser` does not raise on a broken feed; it sets `bozo` instead, which is why the script checks it.

**Automate it:** run it every morning and post the digest to Slack with script 6.

### 9. Organize a folder by file type

File organizers appear in 8 of 13 repos. This one sorts a messy folder (Downloads, a shared drop folder, an export directory) into subfolders by extension, and skips files whose name already exists in the target folder instead of overwriting them.

```python
from pathlib import Path
import shutil

CATEGORIES = {
    "images": {".jpg", ".jpeg", ".png", ".gif", ".webp"},
    "documents": {".pdf", ".docx", ".txt", ".md", ".xlsx", ".csv"},
    "archives": {".zip", ".tar", ".gz"},
}

def organize(folder: str) -> None:
    root = Path(folder).expanduser()
    for path in root.iterdir():
        if not path.is_file():
            continue
        category = next(
            (name for name, exts in CATEGORIES.items() if path.suffix.lower() in exts),
            "other",
        )
        target = root / category
        target.mkdir(exist_ok=True)
        if (target / path.name).exists():
            print(f"Skipped {path.name}: already in {category}/")
            continue
        shutil.move(str(path), str(target / path.name))
        print(f"Moved {path.name} -> {category}/")

if __name__ == "__main__":
    organize("~/Downloads")
```

**Automate it:** run it nightly, or trigger it whenever a new file lands in the folder.

### 10. Find duplicate files

Duplicate finders appear in 7 of 13 repos. This one groups files by size first, then hashes only the files that share a size, which keeps it fast on large folders. It reports duplicates and deletes nothing.

```python
import hashlib
from collections import defaultdict
from pathlib import Path

def file_hash(path: Path, chunk_size: int = 1 << 20) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as f:
        while chunk := f.read(chunk_size):
            digest.update(chunk)
    return digest.hexdigest()

def find_duplicates(folder: str) -> list[list[Path]]:
    by_size = defaultdict(list)
    for path in Path(folder).expanduser().rglob("*"):
        if path.is_file():
            by_size[path.stat().st_size].append(path)
    by_hash = defaultdict(list)
    for paths in by_size.values():
        if len(paths) > 1:  # a file with a unique size cannot have a duplicate
            for path in paths:
                by_hash[file_hash(path)].append(path)
    return [paths for paths in by_hash.values() if len(paths) > 1]

if __name__ == "__main__":
    for group in find_duplicates("~/Documents"):
        print(f"{len(group)} copies:", *group, sep="\n  ")
```

**Automate it:** run it weekly on shared drives and send the report for review rather than deleting automatically.

## 5 production scripts the collections skip

The scripts above save time. The five below prevent incidents, which is why they are the ones teams end up scheduling in production, and why they are nearly absent from the GitHub collections.

### 11. Check website uptime and response time

Only 4 of the 13 collections have a server or website monitor. This script calls a list of URLs and reports the HTTP status and latency of each. It exits with an error code when any site is down, which is what lets a scheduler or orchestrator alert you.

Requires: `requests`.

```python
import sys
import requests

URLS = ["https://kestra.io", "https://example.com"]

def check(urls: list[str]) -> bool:
    healthy = True
    for url in urls:
        try:
            response = requests.get(url, timeout=10)
            ms = round(response.elapsed.total_seconds() * 1000)
            print(f"{url}: {response.status_code} in {ms} ms")
            healthy &= response.ok
        except requests.RequestException as exc:
            print(f"{url}: DOWN ({type(exc).__name__})")
            healthy = False
    return healthy

if __name__ == "__main__":
    sys.exit(0 if check(URLS) else 1)
```

**Automate it:** run it every five minutes. The [website monitoring blueprint](/blueprints/website-monitoring-with-alerts) does this in Kestra with parallel checks, up/down state, and recovery alerts.

### 12. Warn before an SSL certificate expires

None of the 13 collections checks certificate expiry, yet expired certificates still cause outages at companies with mature tooling. This script opens a TLS connection to each domain and fails if a certificate expires within three weeks.

```python
import socket
import ssl
import sys
from datetime import datetime, timezone

def days_until_expiry(domain: str) -> int:
    context = ssl.create_default_context()
    with socket.create_connection((domain, 443), timeout=10) as sock:
        with context.wrap_socket(sock, server_hostname=domain) as tls:
            cert = tls.getpeercert()
    expires = datetime.fromtimestamp(ssl.cert_time_to_seconds(cert["notAfter"]), tz=timezone.utc)
    return (expires - datetime.now(timezone.utc)).days

if __name__ == "__main__":
    expiring = []
    for domain in ["kestra.io", "github.com"]:
        days = days_until_expiry(domain)
        print(f"{domain}: {days} days left")
        if days < 21:
            expiring.append(domain)
    sys.exit(1 if expiring else 0)
```

**Automate it:** run it daily. The [next section](#run-these-scripts-on-a-schedule-with-retries-and-alerts) turns this exact script into a scheduled Kestra flow with a Slack alert.

### 13. Back up a folder to a timestamped archive

Only 3 of 13 collections include a backup script. This one zips a folder into `backup-YYYYMMDD-HHMMSS.zip` and keeps only the most recent archives, so the backup folder never fills the disk.

```python
import shutil
from datetime import datetime
from pathlib import Path

def backup(source: str, destination: str, keep: int = 7) -> str:
    dest = Path(destination).expanduser()
    dest.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    archive = shutil.make_archive(
        str(dest / f"backup-{stamp}"), "zip", root_dir=str(Path(source).expanduser())
    )
    for old in sorted(dest.glob("backup-*.zip"))[:-keep]:
        old.unlink()
    print(f"Created {archive}")
    return archive

if __name__ == "__main__":
    backup("~/projects/reports", "~/backups/reports", keep=7)
```

**Automate it:** run it nightly and copy the archive to object storage in the next step, so the backup does not live on the same disk as the data. For databases, the [PostgreSQL backup blueprint](/blueprints/postgres-backup-s3-restore-verify) dumps to S3 and runs a restore drill to prove the backup works.

### 14. Export a SQL query to CSV

Database scripts appear in 6 of 13 collections, mostly as CRUD examples. In production, the common job is the recurring export: yesterday's orders, last week's signups, a list for the finance team. This script runs a query and streams the result to CSV row by row, so it works on large tables without loading everything in memory.

```python
import csv
import sqlite3

def query_to_csv(db_path: str, query: str, output: str) -> int:
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.execute(query)
        headers = [column[0] for column in cursor.description]
        with open(output, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            count = 0
            for row in cursor:  # streams rows instead of loading the table in memory
                writer.writerow(row)
                count += 1
    finally:
        conn.close()
    print(f"Exported {count} rows to {output}")
    return count

if __name__ == "__main__":
    query_to_csv(
        "app.db",
        "SELECT * FROM orders WHERE created_at >= date('now', '-1 day')",
        "orders-last-24h.csv",
    )
```

The example uses SQLite from the standard library. For PostgreSQL or MySQL, swap the connection for `psycopg` or `PyMySQL`; the cursor logic stays the same.

**Automate it:** run it every morning and email the CSV with script 7. In Kestra, database tasks can run the query and export CSV or Excel without Python, as in the [business automation blueprint](/blueprints/business-automation).

### 15. Summarize errors in a log file

No collection includes a log parser. This script scans a log file for `ERROR` and `CRITICAL` lines, groups similar messages by replacing numbers (IDs, durations, ports) with `N`, and prints the most frequent ones. It turns 50,000 log lines into a ten-line morning summary.

```python
import re
import sys
from collections import Counter

PATTERN = re.compile(r"\b(ERROR|CRITICAL)\b\s*[:\-]?\s*(.*)")

def summarize_errors(log_path: str, top: int = 10) -> None:
    counts = Counter()
    with open(log_path, encoding="utf-8", errors="replace") as f:
        for line in f:
            match = PATTERN.search(line)
            if match:
                message = re.sub(r"\d+", "N", match.group(2))[:120]
                counts[(match.group(1), message)] += 1
    for (level, message), n in counts.most_common(top):
        print(f"{n:>6}  {level:<8} {message}")

if __name__ == "__main__":
    summarize_errors(sys.argv[1] if len(sys.argv) > 1 else "app.log")
```

**Automate it:** run it every morning on the previous day's logs and send the summary to Slack with script 6.

## Run these scripts on a schedule with retries and alerts

Writing the script is the easy part. Running it every day for a year is where automation breaks down. The usual first step is a cron entry, which works until:

- the script fails at 3 a.m. and nobody finds out until a customer does,
- a transient network error kills a run that would have succeeded on retry,
- the logs live on one server, which gets rebuilt,
- two scripts need different versions of the same package,
- the next step should run only after the previous script succeeds, so you add `sleep 600` and hope.

Each of these has a fix you can bolt onto the script (retry loops, log shipping, virtual environments, lock files), and each fix is more code to maintain in every script. That trade-off is covered in depth in the guide to [Python job schedulers](/resources/data/python-job-scheduler) and in [replacing cron](/resources/infrastructure/cron-replacement).

An orchestrator moves those concerns out of the script. In [Kestra](/), the script stays plain Python and the flow around it declares when it runs, how it retries, and what happens when it fails. Here is script 12, the SSL expiry check, as a scheduled job that alerts Slack on failure:

```yaml
id: ssl-certificate-check
namespace: company.ops

inputs:
  - id: domains
    type: ARRAY
    itemType: STRING
    defaults:
      - kestra.io
      - github.com

tasks:
  - id: check-certificates
    type: io.kestra.plugin.scripts.python.Script
    containerImage: python:3.12-slim
    retry:
      type: constant
      maxAttempts: 2
      interval: PT1M
    script: |
      import json
      import socket
      import ssl
      import sys
      from datetime import datetime, timezone

      domains = json.loads('{{ inputs.domains | toJson }}')
      threshold_days = 21
      expiring = []

      for domain in domains:
          context = ssl.create_default_context()
          with socket.create_connection((domain, 443), timeout=10) as sock:
              with context.wrap_socket(sock, server_hostname=domain) as tls:
                  cert = tls.getpeercert()
          expires = datetime.fromtimestamp(
              ssl.cert_time_to_seconds(cert["notAfter"]), tz=timezone.utc
          )
          days_left = (expires - datetime.now(timezone.utc)).days
          print(f"{domain}: {days_left} days left")
          if days_left < threshold_days:
              expiring.append(f"{domain} ({days_left} days)")

      if expiring:
          print("Expiring soon: " + ", ".join(expiring))
          sys.exit(1)

errors:
  - id: alert-slack
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_WEBHOOK_URL') }}"
    messageText: "SSL check failed in {{ flow.namespace }}.{{ flow.id }}: see execution {{ execution.id }}"

triggers:
  - id: every-morning
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 8 * * *"
```

What the flow adds without touching the Python logic:

- **Isolation**: the script runs in its own `python:3.12-slim` container, so its dependencies never clash with another script's. Packages go in `beforeCommands` or a custom image. See how to [run Python in your flows](/docs/how-to-guides/python).
- **Retries**: a network blip retries once after a minute instead of paging someone.
- **Alerting**: the `errors` branch posts to Slack only when the run fails, with the execution ID. The webhook URL comes from a secret, not from the code.
- **Logs and history**: every `print` is captured per execution in the UI, so you can see what the script found last Tuesday without SSH-ing into a server. The [Python Script task](/plugins/plugin-script-python/io.kestra.plugin.scripts.python.script) documents the available options.
- **Inputs**: the domain list is an input, so you can run the check by hand on a new domain from the UI without editing the script.

For longer scripts, keep them in Git and let the flow clone and run them: the [Git + Python blueprint](/blueprints/git-python) shows the pattern, and [this walkthrough](/blogs/2023-11-20-advanced-python-scripts) compares running scripts from GitHub with editing them in Kestra's built-in editor. Once scripts are flow steps, you can also chain them: the SQL export (script 14) runs, the Excel report (script 5) builds only if the export succeeded, and the email (script 7) goes out last. That is [Python orchestration](/resources/data/python-orchestration) rather than scheduling.

## The best GitHub repositories of Python scripts

If fifteen scripts are not enough, these are the largest collections of ready-made Python scripts on GitHub, ranked by stars. They are the 13 repositories analyzed above. Star counts and last-push dates were checked on November 26, 2026.

| Repository | Stars | Last push | What you will find |
|---|---|---|---|
| [geekcomputers/Python](https://github.com/geekcomputers/Python) | 35.5k | Nov 2026 | Hundreds of standalone scripts and small apps: file handling, scrapers, CLI tools, games. |
| [trekhleb/learn-python](https://github.com/trekhleb/learn-python) | 18.6k | Apr 2026 | Scripts grouped by language topic with explanations and tests. Built for learning Python, not for automation. |
| [ndleah/python-mini-project](https://github.com/ndleah/python-mini-project) | 4.5k | Aug 2024 | 120+ community mini projects, each in its own folder with a README, from mailing automation to games. |
| [avinashkranjan/Amazing-Python-Scripts](https://github.com/avinashkranjan/Amazing-Python-Scripts) | 3.7k | Nov 2026 | The largest catalog, with 700+ folders of scripts from basics to automation, scrapers, bots, and AI experiments. |
| [larymak/Python-project-Scripts](https://github.com/larymak/Python-project-Scripts) | 2.5k | Aug 2026 | Scripts sorted by category: automation, bots, conversion scripts, web scraping, GUI, Django and Flask projects. |
| [hastagAB/Awesome-Python-Scripts](https://github.com/hastagAB/Awesome-Python-Scripts) | 2.4k | Sep 2025 | 140+ scripts "that automate stuff", such as CSV to Excel, photo folder cleanup, and mail attachment handling. |
| [realpython/python-scripts](https://github.com/realpython/python-scripts) | 2.2k | Apr 2023 | Small utility scripts from Real Python, including a SQL-to-CSV exporter. Useful reading, but unmaintained since 2023. |
| [wasmerio/Python-Scripts](https://github.com/wasmerio/Python-Scripts) | 1.7k | Feb 2026 | Curated automation scripts such as daily emails, Wi-Fi checks, and CSV conversions. Formerly DhanushNehru/Python-Scripts. |
| [HarshCasper/Rotten-Scripts](https://github.com/HarshCasper/Rotten-Scripts) | 1.5k | May 2024 | Multi-language collection with a large Python folder, plus Bash, Go, JavaScript, PowerShell, and Rust. |
| [techiescamp/python-for-devops](https://github.com/techiescamp/python-for-devops) | 585 | Jul 2025 | DevOps-oriented scripts: AWS with boto3, databases, JSON handling, operating-system tasks. |
| [avidLearnerInProgress/python-automation-scripts](https://github.com/avidLearnerInProgress/python-automation-scripts) | 561 | Jan 2021 | Mostly scrapers and small automation tools, plus a file organizer. Not updated since 2021. |
| [metafy-social/python-scripts](https://github.com/metafy-social/python-scripts) | 469 | May 2024 | Day-to-day automation scripts gathered in a single folder. |
| [patrickloeber/python-task-automation](https://github.com/patrickloeber/python-task-automation) | 153 | Jan 2021 | A small set of productivity scripts, including cron job examples. |

A few rules before you copy anything from these repositories:

- **Read the code first.** Most are community contributions merged with light review. Check what each script deletes, which URLs it calls, and whether it asks for credentials.
- **Check maintenance.** A script written in 2020 may target an API or a library version that no longer exists. The last-push column is a quick filter.
- **Pin dependencies.** Install the versions the script was written for, ideally in a [virtual environment](/resources/data/python-virtual-environment) or a container.
- **Move secrets out.** Replace hard-coded tokens and passwords with environment variables or a secret manager before the script runs anywhere shared.

## Related concepts

- [Python Job Scheduler: Orchestrating Your Workflows](/resources/data/python-job-scheduler)
- [Python Orchestration](/resources/data/python-orchestration)
- [Python Logging](/resources/data/python-logging)
- [Python Subprocess](/resources/data/python-subprocess)
- [Cron Replacement](/resources/infrastructure/cron-replacement)
- [Why a Script Is Not a Plugin](/blogs/why-a-script-is-not-a-plugin)
- [Orchestrate Python Workflows](/docs/use-cases/python-workflows)
