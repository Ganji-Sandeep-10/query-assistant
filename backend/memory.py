import json
import os
from difflib import SequenceMatcher

MEMORY_FILE = "query_memory.json"

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)

def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f, indent=2)

def store_query_result(query, _embedding_unused, summary):
    memory = load_memory()
    memory[query] = summary
    save_memory(memory)

def check_similar_query(query, threshold=0.8):
    memory = load_memory()
    for past_query, summary in memory.items():
        similarity = SequenceMatcher(None, query.lower(), past_query.lower()).ratio()
        if similarity >= threshold:
            return summary
    return None
