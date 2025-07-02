# memory.py

import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

PERSIST_DIR = "./chroma_storage"

# ✅ New client initialization (post-0.4.0+)
client = chromadb.PersistentClient(path=PERSIST_DIR)

embedding_function = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

collection = client.get_or_create_collection(
    name="query_memory",
    embedding_function=embedding_function
)

def store_query_result(query, embedding, summary):
    collection.add(
        documents=[summary],
        embeddings=[embedding],
        ids=[query]
    )

def check_similar_query(embedding, threshold=0.8):
    results = collection.query(
        query_embeddings=[embedding],
        n_results=1
    )
    
    if (
        results 
        and results.get("documents") 
        and results.get("distances")
        and len(results["documents"][0]) > 0 
        and len(results["distances"][0]) > 0
        and results["distances"][0][0] < (1 - threshold)
    ):
        return results["documents"][0][0]
    
    return None

