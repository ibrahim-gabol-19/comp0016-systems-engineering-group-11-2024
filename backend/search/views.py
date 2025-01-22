from django.shortcuts import render
from django.http import JsonResponse
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import requests

# Load the semantic search model globally
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

def perform_semantic_search(query, datasets):
    """
    Perform semantic search across multiple datasets.
    """
    query_embedding = model.encode([query])
    results = []

    for dataset in datasets:
        # Compute cosine similarity for each dataset
        embeddings = model.encode(dataset['documents'])
        similarities = cosine_similarity(query_embedding, embeddings).flatten()

        # Append top 3 results from this dataset
        top_3_indices = similarities.argsort()[-3:][::-1]
        for idx in top_3_indices:
            results.append({
                "source": dataset['source'],
                "title": dataset['titles'][idx],
                "similarity_score": float(similarities[idx]),
            })

    # Sort all results by similarity score
    results = sorted(results, key=lambda x: x["similarity_score"], reverse=True)[:3]
    return results

def search(request):
    query = request.GET.get("query", "")  # Get search query
    if not query:
        return JsonResponse({"error": "Please provide a query."}, status=400)

    # Fetch data from multiple APIs (articles, events, etc.)
    articles = requests.get("http://127.0.0.1:8000/articles/").json()
    events = requests.get("http://127.0.0.1:8000/events/").json()

    # Preprocess the data for semantic search
    datasets = [
        {
            "source": "articles",
            "documents": [a["content"] for a in articles],
            "titles": [a["title"] for a in articles],
        },
        {
            "source": "events",
            "documents": [e["description"] for e in events],  # Event descriptions
            "titles": [e["title"] for e in events],  # Event titles
        },
    ]

    # Perform semantic search
    results = perform_semantic_search(query, datasets)

    return JsonResponse({"query": query, "results": results})
