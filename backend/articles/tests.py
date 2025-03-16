"""
test file for articles
"""
# tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Article

class ArticleTests(APITestCase):
    """
    Test cases for the Article model and views.
    """

    def setUp(self):
        """
        Set up a test article instance.
        """
        self.article_data = {
            'title': 'Test Article',
            'main_image': None,  # You can use a mock image if needed
            'author': 'Test Author',
            'description': 'This is a test description.',
            'content': 'This is the content of the test article.'
        }
        self.article = Article.objects.create(**self.article_data)

    def test_create_article(self):
        """
        Test creating a new article.
        """
        response = self.client.post(reverse('article-list'), self.article_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Article.objects.count(), 2)  # One from setUp and one created
        self.assertEqual(Article.objects.get(id=response.data['id']).title, 'Test Article')

    def test_get_articles(self):
        """
        Test retrieving the list of articles.
        """
        response = self.client.get(reverse('article-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         "Expected status code 200 when retrieving articles")
        self.assertEqual(len(response.data), 1)  # Only the article created in setUp

    def test_update_article(self):
        """
        Test updating an existing article.
        """
        updated_data = {
            'title': 'Updated Article',
            'main_image': None,
            'author': 'Updated Author',
            'description': 'This is an updated description.',
            'content': 'This is the updated content of the article.'
        }
        url = reverse('article-detail', args=[self.article.id])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.article.refresh_from_db()
        self.assertEqual(self.article.title, 'Updated Article')

    def test_delete_article(self):
        """
        Test deleting an article.
        """
        response = self.client.delete(reverse('article-detail', args=[self.article.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Article.objects.count(), 0)  # Article should be deleted

    def test_article_str(self):
        """
        Test the string representation of the Article model.
        """
        self.assertEqual(str(self.article), 'Test Article')
