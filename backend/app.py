# app.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from classifier import is_valid_query_rule_based, is_valid_query_llm_groq
from summarizer import summarize
from search_scraper import fetch_and_scrape
from memory import store_query_result, check_similar_query

app = FastAPI(title="Query Agent API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & response models
class QueryRequest(BaseModel):
    query: str

class SourceLink(BaseModel):
    title: str
    url: str
    snippet: Optional[str] = ""

class QueryResponse(BaseModel):
    valid: bool
    source: str
    summary: str
    links: Optional[List[SourceLink]] = None

@app.post("/query", response_model=QueryResponse)
def handle_query(req: QueryRequest):
    query = req.query.strip()

    # 1. Rule-based check
    if not is_valid_query_rule_based(query):
        return QueryResponse(valid=False, source="rule-based", summary="❌ Invalid query (rule-based).")

    # 2. LLM-based check
    if not is_valid_query_llm_groq(query):
        return QueryResponse(valid=False, source="llm", summary="❌ Invalid query (LLM-based).")

    # 3. Memory similarity check (text-based)
    similar = check_similar_query(query)
    if similar:
        return QueryResponse(valid=True, source="memory", summary=similar, links=[])

    # 4. Search and scrape
    content, links = fetch_and_scrape(query)
    if not content:
        raise HTTPException(status_code=500, detail="❌ Failed to extract usable content.")

    # 5. Summarize
    summary = summarize(content, query=query)

    # 6. Store result
    store_query_result(query, None, summary)

    return QueryResponse(valid=True, source="fresh", summary=summary, links=links)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lightweight Web Query Agent API!"}
