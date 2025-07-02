import os
import logging
import requests
from bs4 import BeautifulSoup
from newspaper import Article
from playwright.sync_api import sync_playwright
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
        return results.get("items", [])  # full result items, not just URLs
    except Exception as e:
        logger.error(f"[ERROR] Google search failed: {e}")
        return []


def scrape_with_playwright(url):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, timeout=15000)
            html = page.content()
            title = page.title()
            browser.close()

        soup = BeautifulSoup(html, "html.parser")
        paragraphs = soup.find_all("p")
        text = "\n".join(p.get_text().strip() for p in paragraphs if len(p.get_text()) > 40)
        return text.strip(), title
    except Exception as e:
        logger.warning(f"[playwright failed] {url}: {e}")
        return None, None


def scrape_with_newspaper(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text.strip(), article.title
    except Exception as e:
        logger.warning(f"[newspaper3k failed] {url}: {e}")
        return None, None


def scrape_main_content(url):
    logger.info(f"[INFO] Scraping: {url}")
    content, title = scrape_with_playwright(url)
    if not content:
        content, title = scrape_with_newspaper(url)
    if not content:
        logger.error(f"[ERROR] Empty content for URL {url}")
    return content, title or url.split('/')[2]  # fallback title


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

        content, title = scrape_main_content(url)
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
