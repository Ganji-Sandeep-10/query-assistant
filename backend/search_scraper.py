import os
import logging
import requests
from bs4 import BeautifulSoup
from config import GOOGLE_API_KEY, GOOGLE_CSE_ID

logger = logging.getLogger(__name__)


def google_search(query, num_results=5):
    logger.info("[INFO] Querying Google Programmable Search...")
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": GOOGLE_API_KEY,
        "cx": GOOGLE_CSE_ID,
        "q": query,
        "num": num_results,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        results = response.json()
        return results.get("items", [])
    except Exception as e:
        logger.error(f"[ERROR] Google search failed: {e}")
        return []


def simple_scrape(url):
    logger.info(f"[INFO] Scraping: {url}")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        title = soup.title.string if soup.title else url.split('/')[2]

        paragraphs = soup.find_all("p")
        text = "\n".join(p.get_text().strip() for p in paragraphs if len(p.get_text()) > 40)

        return text.strip(), title
    except Exception as e:
        logger.warning(f"[ERROR] Failed to scrape {url}: {e}")
        return None, None


def fetch_and_scrape(query, num_results=5):
    search_items = google_search(query, num_results=num_results)
    if not search_items:
        return "", []

    content_blocks = []
    links = []

    for item in search_items:
        url = item.get("link")
        if not url:
            continue

        content, title = simple_scrape(url)
        if content:
            snippet = content[:200].strip().replace('\n', ' ')
            content_blocks.append(content)
            links.append({
                "title": title,
                "url": url,
                "snippet": snippet
            })

    combined_content = "\n\n".join(content_blocks)
    return combined_content, links
