"""
articles/utils.py
"""

from .models import Article
from .serializers import ArticleSerializer

def get_articles():
    """
    Retrieve all articles.
    """
    articles = Article.objects.all()
    serializer = ArticleSerializer(articles, many=True)
    return serializer.data
