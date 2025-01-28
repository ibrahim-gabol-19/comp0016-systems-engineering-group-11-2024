"""
serializers.py
"""
from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article
    """
    class Meta:
        model = Article
        fields = '__all__'
