import re
import os
import httpx
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))


def extract_video_id(url: str) -> str:
    patterns = [
        r"(?:v=)([0-9A-Za-z_-]{11})",
        r"youtu\.be\/([0-9A-Za-z_-]{11})",
        r"(?:embed\/)([0-9A-Za-z_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError("Invalid YouTube URL. Could not extract video ID.")


def get_transcript(url: str) -> dict:
    video_id = extract_video_id(url)
    api_key  = os.getenv("SUPADATA_API_KEY")

    if api_key:
        return _fetch_via_supadata(video_id, api_key)
    else:
        return _fetch_via_library(video_id)


def _fetch_via_supadata(video_id: str, api_key: str) -> dict:
    with httpx.Client(timeout=30) as client:
        res = client.get(
            "https://api.supadata.ai/v1/youtube/transcript",
            params={"videoId": video_id, "lang": "en"},
            headers={"x-api-key": api_key},
        )

    if res.status_code == 404:
        raise ValueError("No transcript found for this video.")
    if res.status_code == 403:
        raise ValueError("Transcript is disabled for this video.")
    if res.status_code not in (200, 206):
        raise ValueError(f"Transcript API error: {res.status_code}")

    data = res.json()
    content = data.get("content", [])

    if not content:
        raise ValueError("Transcript is empty.")

    full_text = " ".join(
        item["text"] for item in content if item.get("text")
    )
    duration = content[-1].get("offset", 0) / 1000 if content else 0

    return {
        "video_id": video_id,
        "transcript": full_text,
        "duration": round(duration),
        "language": data.get("lang", "en"),
    }


def _fetch_via_library(video_id: str) -> dict:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
    import os

    proxy_host     = os.getenv("PROXY_HOST")
    proxy_port     = os.getenv("PROXY_PORT", "80")
    proxy_username = os.getenv("PROXY_USERNAME")
    proxy_password = os.getenv("PROXY_PASSWORD")

    if proxy_host and proxy_username:
        from youtube_transcript_api import Proxies
        proxy_url = f"http://{proxy_username}:{proxy_password}@{proxy_host}:{proxy_port}"
        api = YouTubeTranscriptApi(proxies=Proxies(http=proxy_url, https=proxy_url))
    else:
        api = YouTubeTranscriptApi()

    try:
        transcript_list = api.list(video_id)
        transcript = None

        try:
            transcript = transcript_list.find_manually_created_transcript(["en"])
        except Exception:
            pass

        if transcript is None:
            try:
                transcript = transcript_list.find_generated_transcript(["en"])
            except Exception:
                pass

        if transcript is None:
            all_t = list(transcript_list)
            if not all_t:
                raise ValueError("No transcripts available.")
            transcript = all_t[0]

        data = transcript.fetch()
        if not data:
            raise ValueError("Transcript is empty.")

        duration  = data[-1]["start"] + data[-1].get("duration", 0)
        full_text = " ".join(e["text"].strip() for e in data)

        return {
            "video_id": video_id,
            "transcript": full_text,
            "duration": round(duration),
            "language": transcript.language_code,
        }

    except (TranscriptsDisabled, ValueError):
        raise
    except Exception as e:
        raise ValueError(f"Failed to fetch transcript: {str(e)}")