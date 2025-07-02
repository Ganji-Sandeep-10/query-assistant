# summarizer.py

import os
import logging
import requests
import json
from transformers import BartTokenizer, BartForConditionalGeneration
import torch

logger = logging.getLogger(__name__)

# Gemini setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

# HuggingFace fallback setup
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)


def build_prompt(text, query=None):
    """Construct a rich, query-aware summarization prompt."""
    if query:
        return (
            f"You are a research assistant. A user asked:\n\n"
            f"❓ \"{query}\"\n\n"
            f"Use the extracted web content below to craft a helpful, informative, and accurate answer "
            f"that directly addresses the question. The answer should be clear, insightful, and synthesized.\n\n"
            f"### Content:\n{text}\n\n"
            f"### Answer:"
        )
    return f"Summarize this:\n\n{text}\n\nSummary:"


def summarize(text, query=None, max_summary_length=256):
    """Use Gemini to summarize with prompt, fallback to BART if it fails."""
    prompt = build_prompt(text, query)

    # Try Gemini
    if GEMINI_API_KEY:
        logger.info("INFO: Summarizing content using Gemini...")
        try:
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
        except Exception as e:
            logger.error(f"Gemini summarization failed: {e}")

    # Fallback to HuggingFace
    logger.info("INFO: Summarizing with HuggingFace BART fallback...")
    try:
        inputs = tokenizer(prompt, return_tensors="pt", max_length=1024, truncation=True).to(device)
        summary_ids = model.generate(inputs["input_ids"], max_length=max_summary_length, num_beams=4, early_stopping=True)
        return tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except Exception as e:
        logger.error(f"HuggingFace summarization failed: {e}")
        return "[Summary failed]"
