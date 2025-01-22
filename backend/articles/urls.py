# articles/urls.py
from django.urls import path
from .views import search_articles

urlpatterns = [
    path("search/", search_articles, name="search_articles"), # Search articles endpoint

]