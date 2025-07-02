import os
import json
import numpy as np
import requests
from typing import Optional

MEMORY_FILE = "query_memory.json"
HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-small-en-v1.5"
HF_TOKEN = os.getenv("HF_TOKEN")  # Set your Hugging Face token as an environment variable

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}


# --- Helper Functions --- #

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)


def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)


def cosine_similarity(vec1, vec2):
    a = np.array(vec1)
    b = np.array(vec2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def get_embedding(text: str) -> Optional[list]:
    body = {
        "inputs": text,
        "options": {"wait_for_model": True}
    }

    try:
        response = requests.post(HF_API_URL, headers=HEADERS, json=body)
        response.raise_for_status()
        embedding = response.json()
        return embedding[0] if isinstance(embedding, list) else None
    except Exception as e:
        print(f"[ERROR] Failed to get embedding from HuggingFace: {e}")
        return None


# --- Public API --- #

def store_query_result(query: str, _embedding_unused, summary: str):
    """Stores the query along with its embedding and summary."""
    embedding = get_embedding(query)
    if embedding is None:
        print("[WARNING] Embedding not saved due to error.")
        return

    memory = load_memory()
    memory[query] = {
        "summary": summary,
        "embedding": embedding
    }
    save_memory(memory)


def check_similar_query(query: str, threshold: float = 0.85) -> Optional[str]:
    """Check for semantically similar query in memory."""
    query_embedding = get_embedding(query)
    if query_embedding is None:
        return None

    memory = load_memory()
    for past_query, entry in memory.items():
        past_embedding = entry.get("embedding")
        if not past_embedding:
            continue

        similarity = cosine_similarity(query_embedding, past_embedding)
        if similarity >= threshold:
            print(f"[INFO] Found similar query: '{past_query}' (sim={similarity:.2f})")
            return entry["summary"]

    return None
