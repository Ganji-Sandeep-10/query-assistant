# classifier.py

import requests
from config import GROQ_API_KEY

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama3-8b-8192"

import re

INVALID_PATTERNS = [
    r"^(add|buy|remind|walk|call|message|email|schedule|set alarm|turn on|turn off|play music)\b"
]

def is_valid_query_rule_based(query: str) -> bool:
    query = query.lower().strip()
    return not any(re.search(pat, query) for pat in INVALID_PATTERNS)


def is_valid_query_llm_groq(query: str) -> bool:
    """Uses Groq + LLaMA3 to classify if the query is valid"""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a query classifier. For each query below, respond with 'Valid' or 'Invalid' to indicate whether the query is a valid web search query.\n"
                )
            },
            {
                "role": "user",
                "content": query
            }
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=body)
        response.raise_for_status()
        answer = response.json()["choices"][0]["message"]["content"].strip().lower()
        return answer == "valid"
    except Exception as e:
        print(f"[ERROR] Groq LLM query validation failed: {e}")
        return True  # Fallback: allow
