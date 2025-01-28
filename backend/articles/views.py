"""
views.py
"""
from rest_framework import viewsets
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    Article View Set
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
