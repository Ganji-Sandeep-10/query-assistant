import os
import logging
import requests
import json

logger = logging.getLogger(__name__)

# Gemini setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"


def build_prompt(text, query=None):
    """Construct a rich, query-aware summarization prompt."""
    if query:
        return (
            f"You are a research assistant. A user asked:\n\n"
            f"❓ \"{query}\"\n\n"
            f"Use the extracted web content below to craft a helpful, informative, and accurate answer "
            f"that directly addresses the question. Be clear, insightful, and concise.\n\n"
            f"### Content:\n{text}\n\n"
            f"### Answer:"
        )
    return f"Summarize this:\n\n{text}\n\nSummary:"


def summarize(text, query=None):
    """Use Gemini API to summarize."""
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is not set.")
        return "[Summary unavailable]"

    prompt = build_prompt(text, query)

    try:
        logger.info("INFO: Summarizing content using Gemini...")
        body = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ]
        }

        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(body)
        )
        response.raise_for_status()

        candidates = response.json().get("candidates", [])
        if candidates:
            summary = candidates[0]["content"]["parts"][0]["text"]
            return summary.strip()
        else:
            return "[No summary returned]"

    except Exception as e:
        logger.error(f"Gemini summarization failed: {e}")
        return "[Summary failed]"
