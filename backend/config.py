# config.py

import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

missing = []

if not GOOGLE_API_KEY or not GOOGLE_CSE_ID:
    missing.append("GOOGLE_API_KEY or GOOGLE_CSE_ID")

if not GEMINI_API_KEY:
    missing.append("GEMINI_API_KEY")

if not GROQ_API_KEY:
    missing.append("GROQ_API_KEY")

if missing:
    raise ValueError(f"❌ Missing environment variables: {', '.join(missing)}")
