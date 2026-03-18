from kestra import Kestra
from datetime import datetime
from pathlib import Path
from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString

def find_tutorial_videos_dir() -> Path:
    tutorial_videos_dir = Path.cwd() / "src" / "contents" / "tutorial-videos"

    if tutorial_videos_dir.exists():
        return tutorial_videos_dir

    raise FileNotFoundError(
        f"Could not find tutorial videos directory at {tutorial_videos_dir}"
    )


def next_video_file_path(tutorial_videos_dir: Path) -> Path:
    existing_numbers = []

    for path in tutorial_videos_dir.glob("*.yaml"):
        try:
            existing_numbers.append(int(path.stem))
        except ValueError:
            continue

    next_number = max(existing_numbers, default=0) + 1
    return tutorial_videos_dir / f"{next_number}.yaml"


def latest_video_file_path(tutorial_videos_dir: Path) -> Path | None:
    existing_numbers = []

    for path in tutorial_videos_dir.glob("*.yaml"):
        try:
            existing_numbers.append((int(path.stem), path))
        except ValueError:
            continue

    if not existing_numbers:
        return None

    return max(existing_numbers, key=lambda item: item[0])[1]


raw_yt = {
  "kind": "youtube#searchListResponse",
  "etag": "0suJYmD-Hma_0GMIX6431jK27N4",
  "nextPageToken": "CAEQAA",
  "regionCode": "ZZ",
  "pageInfo": {
    "totalResults": 326,
    "resultsPerPage": 1
  },
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "RN8Xpz0HkYLVx7iu6PS1AYowr0c",
      "id": {
        "kind": "youtube#video",
        "videoId": "N0LXeyIfIKI"
      },
      "snippet": {
        "publishedAt": "2026-03-13T07:05:20Z",
        "channelId": "UCMCsjAEnJXzGsg_IAZF8WHQ",
        "title": "Orchestration &amp; Kestra 101 Webinar",
        "description": "What is orchestration, and when do you actually need it? Join Amara and Parham for a live, beginner-friendly introduction to ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/N0LXeyIfIKI/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/N0LXeyIfIKI/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/N0LXeyIfIKI/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Kestra",
        "liveBroadcastContent": "none",
        "publishTime": "2026-03-13T07:05:20Z"
      }
    }
  ]
}

last_video = raw_yt["items"][0]

date_object = datetime.strptime(
    last_video["snippet"]["publishedAt"], "%Y-%m-%dT%H:%M:%SZ"
)

video = {
    "title": DoubleQuotedScalarString(last_video["snippet"]["title"]),
    "description": DoubleQuotedScalarString(last_video["snippet"]["description"]),
    "category": DoubleQuotedScalarString("Feature Highlight"),
    "author": DoubleQuotedScalarString("Kestra"),
    "url": DoubleQuotedScalarString(
        f"https://youtube.com/watch?v={last_video['id']['videoId']}"
    ),
    "publicationDate": DoubleQuotedScalarString(
        date_object.strftime("%Y-%m-%dT00:00:00.000")
    ),
    "contentType": DoubleQuotedScalarString("Feature Highlight"),
}

yaml = YAML()
yaml.default_flow_style = False
yaml.preserve_quotes = True

tutorial_videos_dir = find_tutorial_videos_dir()
latest_video_path = latest_video_file_path(tutorial_videos_dir)
latest_video_url = None

if latest_video_path is not None:
    with open(latest_video_path, "r", encoding="utf-8") as file:
        latest_video_yaml = yaml.load(file) or {}
        latest_video_url = latest_video_yaml.get("url")

if latest_video_url == str(video["url"]):
    Kestra.outputs(
        {"title": video["title"], "url": video["url"], "created_file": False}
    )
    raise SystemExit(0)

output_path = next_video_file_path(tutorial_videos_dir)

with open(output_path, "w", encoding="utf-8") as file:
    yaml.dump(video, file)

Kestra.outputs(
    {"title": video["title"], "url": video["url"], "created_file": True}
)
