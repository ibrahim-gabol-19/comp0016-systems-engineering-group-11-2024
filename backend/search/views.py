"""
Search views module.

This module handles semantic search by retrieving articles and events,
preprocessing their data, and performing a semantic search using a 
SentenceTransformer model.
"""

from sentence_transformers import SentenceTransformer  # pylint: disable=E0401
from sklearn.metrics.pairwise import cosine_similarity  # pylint: disable=E0401
from django.http import JsonResponse
import requests  # pylint: disable=E0401

# Load the model
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")


def preprocess_data(articles, events):
    """
    Preprocess the data for semantic search by concatenating relevant fields.
    """
    datasets = []

    if articles:
        datasets.append({
            "source": "article",
            "documents": [
                (
                    f"{a['title']} {a['description']} {a['content']}"
                    f"{a['author']} {a['published_date']}"
                )
                for a in articles
                if all(key in a for key in ["title", "description", "content",
                                             "author", "published_date"])
            ],
            "entries": articles,  # Keep full article data for frontend use
        })

    if events:
        datasets.append({
            "source": "event",
            "documents": [
                f"{e.get('title', '')} {e.get('event_type', '')} {e.get('description', '')} "
                f"{e.get('location', '')} {e.get('date', '')} {e.get('time', '')} "
                f"{e.get('opening_times', '')} {e.get('poi_type', '')}"
                for e in events
            ],
            "entries": events,
        }) 
    return datasets


def perform_semantic_search(query, datasets):
    """
    Perform semantic search across multiple datasets.
    """
    query_embedding = model.encode([query])
    results = []

    for dataset in datasets:
        if not dataset["documents"]:  # Check if documents list is empty
            continue  # Skip this dataset if it has no documents

        # Compute cosine similarity for each dataset
        embeddings = model.encode(dataset["documents"])
        # Check if embeddings is empty after encoding
        if not embeddings.any(): #embeddings may be empty if all documents are empty.
            continue
        similarities = cosine_similarity(query_embedding, embeddings).flatten()

        # Append top 3 results from this dataset with full details
        top_3_indices = similarities.argsort()[-3:][::-1]
        for idx in top_3_indices:
            try:  # Handle potential IndexError if fewer than 3 results
                result_entry = dataset["entries"][idx]
                result_entry["similarity_score"] = float(similarities[idx])
                result_entry["source"] = dataset["source"]
                results.append(result_entry)
            except IndexError:
                pass #If there are less than 3 results for a dataset, ignore the error


    # Sort all results by similarity score and return top 3 overall
    results = sorted(results, key=lambda x: x["similarity_score"],reverse=True)[:3]
    return results


def search(request):
    """
    Main search function.
    """
    query = request.GET.get("query", "")
    if not query:
        return JsonResponse({"error": "Please provide a query."}, status=400)

    # Retrieve the token from the incoming request (if provided)
    auth_header = request.headers.get("Authorization")
    headers = {}
    if auth_header:
        headers["Authorization"] = auth_header

    try:
        articles = requests.get(
            "http://127.0.0.1:8000/articles/", headers=headers, timeout=10
        ).json()
        events = requests.get(
            "http://127.0.0.1:8000/events/search/", headers=headers, timeout=10
        ).json()
    except requests.exceptions.RequestException as e:
        return JsonResponse(
            {"error": "Failed to fetch data.", "details": str(e)},
            status=500
        )

    if not articles and not events:
        return JsonResponse({"error": "No data available for search."}, status=404)

    # Preprocess the data and perform semantic search
    datasets = preprocess_data(articles, events)
    results = perform_semantic_search(query, datasets)

    return JsonResponse({"query": query, "results": results})
