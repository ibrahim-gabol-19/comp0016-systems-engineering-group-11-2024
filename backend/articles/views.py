from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer
from backend.semanticSearch.semanticSearch import preprocess_articles, compute_embeddings, semantic_search
from django.http import JsonResponse

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

# Performs the semantic search on all articles.
def search_articles(request):
    query = request.GET.get("query", "")  # Get the search query from the request
    if not query:
        return JsonResponse({"error": "Please provide a query."}, status=400)
    
    # Fetch all articles from the database
    articles = Article.objects.all()

    # Preprocess articles and compute embeddings
    documents = preprocess_articles(articles)
    doc_embeddings = compute_embeddings(documents)

    # Perform semantic search
    results = semantic_search(query, doc_embeddings, articles)

    # Return results as JSON
    return JsonResponse({"query": query, "results": results})
