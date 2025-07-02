# main.py

import logging
from rich import print
from rich.panel import Panel
from sentence_transformers import SentenceTransformer
from classifier import is_valid_query_rule_based, is_valid_query_llm_groq
from search_scraper import fetch_and_scrape
from summarizer import summarize
from memory import check_similar_query, store_query_result

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

print(Panel.fit("🧠 Web Query Agent", subtitle="Smart Info Summarizer"))

# Load models
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# CLI
query = input("Enter your query: ").strip()

# 1. Rule-based sanity filter
if not is_valid_query_rule_based(query):
    print("[red]❌ This is not a valid query (rule-based check).[/red]")
    exit()

if not is_valid_query_llm_groq(query):
    print("[red]❌ This is not a valid query (LLM check via Groq).[/red]")
    exit()


print("✅ This is a valid query. Continuing...")

# 3. Check for similar past queries
embedding = embedding_model.encode(query)
similar_result = check_similar_query(embedding)

if similar_result:
    print("[green]🔁 Found similar query. Returning cached result...[/green]")
    print(Panel(similar_result, title="📄 Summary"))
    exit()

# 4. New query → Search + Scrape
print("\n🌐 Searching and scraping the web...")
combined_text = fetch_and_scrape(query)

if not combined_text:
    print("[red]❌ Failed to extract any usable content.[/red]")
    exit()

# 5. Summarize using LLM or fallback
summary = summarize(combined_text, query=query)

# 6. Store result in memory and display
store_query_result(query, embedding, summary)
print(Panel.fit(summary, title="📄 Summary", border_style="green"))
