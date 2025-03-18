"""
This module contains unit tests for the 'api' app.
It tests the views and serializers to ensure they work as expected.
"""

import os
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.test import SimpleTestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from .models import Item
from .views import (
    extract_event_data, extract_article_data, extract_event_data_ics,
    normalise_date, normalise_time, extract_unstructured_title,
    extract_unstructured_date, extract_unstructured_time,
    extract_unstructured_location, extract_unstructured_description,
    extract_unstructured_author
)

class ApiTests(APITestCase):
    """
    Test cases for the API views.
    """

    def setUp(self):
        """
        Set up the test client and create a test item.
        """
        self.client = APIClient()
        self.item = Item.objects.create(
            name="Test Item",
            description="This is a test item",
            location="Test Location"
        )

    def test_item_model(self):
        """
        Test the Item model's string representation.
        """
        self.assertEqual(str(self.item), "Test Item")

    def test_item_list_view(self):
        """
        Test the ItemViewSet list view.
        """
        response = self.client.get(reverse('item-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Sample Item")

    def test_upload_pdf_and_extract_data_event(self):
        """
        Test the upload_pdf_and_extract_data view for event PDFs.
        """
        pdf_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_event.pdf')
        with open(pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                reverse('upload_pdf_and_extract_data', args=['event']),
                {'pdf_file': SimpleUploadedFile(pdf_file.name, pdf_file.read())},
            )

        # Assert the status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                        "Expected status code 200 for event PDF processing")

        # Parse the JSON response
        response_data = response.json()

        # Check for required keys in the response JSON
        self.assertIn('title', response_data)
        self.assertIn('date_of_event', response_data)
        self.assertIn('time_of_event', response_data)
        self.assertIn('description', response_data)
        self.assertIn('location', response_data)
        self.assertIn('images', response_data)

        # Verify the expected values in the response JSON
        self.assertEqual(response_data['title'], "The Great London Street Food Festival 2025")
        self.assertEqual(response_data['date_of_event'], "02/06/2025")
        self.assertEqual(response_data['time_of_event'], "11:00")
        self.assertEqual(response_data['location'], "Southbank Centre, London")
        self.assertEqual(response_data['images'], [])



    def test_upload_pdf_and_extract_data_article(self):
        """
        Test the upload_pdf_and_extract_data view for article PDFs.
        """
        pdf_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_article.pdf')
        with open(pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                reverse('upload_pdf_and_extract_data', args=['article']),
                {'pdf_file': SimpleUploadedFile(pdf_file.name, pdf_file.read())},
            )

        # Assert that the status code is 200
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                        "Expected status code 200 for article PDF processing")

        # Get the JSON response
        response_data = response.json()

        # Assert that the required fields are in the response
        self.assertIn('title', response_data)
        self.assertIn('description', response_data)
        self.assertIn('main_content', response_data)
        self.assertIn('author', response_data)
        self.assertIn('images', response_data)
        self.assertIn('date', response_data)

        # Assert that the values of the fields match the expected data
        self.assertEqual(
            response_data['title'],
            "New Article page This is a heading"
        )

        self.assertEqual(
            response_data['description'],
            "New Article page\nThis is a heading\nThis is an image"
        )

        self.assertEqual(
            response_data['main_content'],
            "New Article page\nThis is a heading\nThis is an image"
        )

        self.assertEqual(response_data['author'], "")
        self.assertEqual(response_data['date'], "18/03/2025")

        # Assert that the 'images' list contains the correct image file name
        self.assertEqual(response_data['images'], ["event_image_page1_6.png"])


    def test_upload_pdf_and_extract_data_article2(self):
        """
        Test the upload_pdf_and_extract_data view for article PDFs.
        """
        pdf_path = os.path.join(
            settings.BASE_DIR,
            'api', 
            'tests', 
            'Embracing Sustainable Living in London. A Guide for Visitors and Locals Alike.pdf'
        )
        with open(pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                reverse('upload_pdf_and_extract_data', args=['article']),
                {'pdf_file': SimpleUploadedFile(pdf_file.name, pdf_file.read())},
            )

        # Assert that the status code is 200
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                        "Expected status code 200 for article PDF processing")

        # Get the JSON response
        response_data = response.json()

        # Assert that the required fields are in the response
        self.assertIn('title', response_data)
        self.assertIn('description', response_data)
        self.assertIn('main_content', response_data)
        self.assertIn('author', response_data)
        self.assertIn('images', response_data)
        self.assertIn('date', response_data)

        # Assert that the values of the fields match the expected data
        self.assertEqual(response_data['title'], "Embracing Sustainable Living in London.")
        self.assertEqual(response_data['author'], "London City Council Team")
        self.assertEqual(response_data['date'], "18/03/2025")

    def test_upload_pdf_and_extract_data_article3(self):
        """
        Test the upload_pdf_and_extract_data view for article PDFs.
        """
        pdf_path = os.path.join(
            settings.BASE_DIR,
            'api',
            'tests',
            'Embracing Sustainable Living in London. A Guide for Visitors and Locals Alike_2.pdf'
        )
        with open(pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                reverse('upload_pdf_and_extract_data', args=['article']),
                {'pdf_file': SimpleUploadedFile(pdf_file.name, pdf_file.read())},
            )

        # Assert that the status code is 200
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                        "Expected status code 200 for article PDF processing")

        # Get the JSON response
        response_data = response.json()

        # Assert that the required fields are in the response
        self.assertIn('title', response_data)
        self.assertIn('description', response_data)
        self.assertIn('main_content', response_data)
        self.assertIn('author', response_data)
        self.assertIn('images', response_data)
        self.assertIn('date', response_data)

        # Assert that the values of the fields match the expected data
        self.assertEqual(response_data['title'], "Embracing Sustainable Living in London.")
        self.assertEqual(response_data['author'], "Greg Davis")
        self.assertEqual(response_data['date'], "18/03/2025")


    def test_upload_empty_ics(self):
        """
        Empty ics view.
        """
        ics_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'empty.ics')
        with open(ics_path, 'rb') as ics_file:
            response = self.client.post(
                reverse('upload_ics'),
                {'ics_file': SimpleUploadedFile(ics_file.name, ics_file.read())}
            )

        # Assert that the status code is OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Get the response JSON data
        response_json = response.json()

        # Assert the keys are in the response JSON
        self.assertIn('title', response_json)


    def test_upload_ics_and_extract_event_data(self):
        """
        Test the upload_ics_and_extract_event_data view.
        """
        ics_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_event.ics')
        with open(ics_path, 'rb') as ics_file:
            response = self.client.post(
                reverse('upload_ics'),
                {'ics_file': SimpleUploadedFile(ics_file.name, ics_file.read())}
            )

        # Assert that the status code is OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Get the response JSON data
        response_json = response.json()

        # Assert the keys are in the response JSON
        self.assertIn('title', response_json)
        self.assertIn('date_of_event', response_json)
        self.assertIn('time_of_event', response_json)
        self.assertIn('description', response_json)
        self.assertIn('location', response_json)

        # Assert the values match the expected values
        self.assertEqual(response_json['title'], 'Test event')
        self.assertEqual(response_json['date_of_event'], '16/03/2025')
        self.assertEqual(response_json['time_of_event'], '11:00')
        self.assertEqual(response_json['description'], 'This is a test event')
        self.assertEqual(response_json['location'], 'London')



class UtilityFunctionTests(TestCase):
    """
    Test cases for utility functions in the API.
    """

    def test_normalise_date(self):
        """
        Test the normalise_date function.
        """
        self.assertEqual(normalise_date("25 December 2023"), "25/12/2023")
        self.assertEqual(normalise_date("25th December 2023"), "25/12/2023")
        self.assertEqual(normalise_date("25/12/2023"), "25/12/2023")
        self.assertEqual(normalise_date("Invalid Date"), "")

    def test_normalise_time(self):
        """
        Test the normalise_time function.
        """
        self.assertEqual(normalise_time("10:30 AM"), "10:30")
        self.assertEqual(normalise_time("10:30 PM"), "22:30")
        self.assertEqual(normalise_time("10:30"), "10:30")
        self.assertEqual(normalise_time("Invalid Time"), "")

    def test_extract_unstructured_title(self):
        """
        Test the extract_unstructured_title function.
        """
        sentences = ["This is the first line.", "This is the second line."]
        self.assertEqual(extract_unstructured_title(sentences), "This is the first line.")

    def test_extract_unstructured_date(self):
        """
        Test the extract_unstructured_date function.
        """
        text = "The event will take place on 25 December 2023."
        self.assertEqual(extract_unstructured_date(text), "25/12/2023")

    def test_extract_unstructured_time(self):
        """
        Test the extract_unstructured_time function.
        """
        text = "The event starts at 10:30 AM."
        self.assertEqual(extract_unstructured_time(text), "10:30")

    def test_extract_unstructured_location(self):
        """
        Test the extract_unstructured_location function.
        """
        text = "The event will be held at the Grand Hall, New York."
        sentences = text.split(". ")
        self.assertIn("Grand Hall", extract_unstructured_location(text, sentences))

    def test_extract_unstructured_description(self):
        """
        Test the extract_unstructured_description function.
        """
        text = "This is the first paragraph.\n\nThis is the second paragraph."
        expected_output = (
            "This is the first paragraph.\n\n"
            "This is the second paragraph."
        )

        self.assertEqual(extract_unstructured_description(text), expected_output)

    def test_extract_unstructured_author(self):
        """
        Test the extract_unstructured_author function.
        """
        text = "By John Doe"
        self.assertEqual(extract_unstructured_author(text), "John Doe")


class ExtractDataTests(SimpleTestCase):
    """
    Test cases for data extraction functions in the API.
    """

    def test_extract_event_data(self):
        """
        Test the extract_event_data function.
        """
        pdf_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_event.pdf')
        data = extract_event_data(pdf_path)
        self.assertIn('title', data)
        self.assertIn('date_of_event', data)
        self.assertIn('location', data)

    def test_extract_article_data(self):
        """
        Test the extract_article_data function.
        """
        pdf_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_article.pdf')
        data = extract_article_data(pdf_path)
        self.assertIn('title', data)
        self.assertIn('author', data)
        self.assertIn('main_content', data)

    def test_extract_event_data_ics(self):
        """
        Test the extract_event_data_ics function.
        """
        ics_path = os.path.join(settings.BASE_DIR, 'api', 'tests', 'test_event.ics')
        data = extract_event_data_ics(ics_path)
        self.assertIn('title', data)
        self.assertIn('date_of_event', data)
        self.assertIn('location', data)


class EdgeCaseTests(SimpleTestCase):
    """
    Test cases for edge cases in the API.
    """

    def test_normalise_date_invalid_format(self):
        """
        Test the normalise_date function with invalid date formats.
        """
        self.assertEqual(normalise_date("Invalid Date"), "")
        self.assertEqual(normalise_date(""), "")
        self.assertEqual(normalise_date("32/13/2023"), "")

    def test_normalise_time_invalid_format(self):
        """
        Test the normalise_time function with invalid time formats.
        """
        self.assertEqual(normalise_time("Invalid Time"), "")
        self.assertEqual(normalise_time(""), "")
        self.assertEqual(normalise_time("25:70"), "")

    def test_extract_unstructured_title_empty_list(self):
        """
        Test the extract_unstructured_title function with an empty list.
        """
        self.assertEqual(extract_unstructured_title([]), "")

    def test_extract_unstructured_location_no_keywords(self):
        """
        Test the extract_unstructured_location function with text that doesn't 
        contain location keywords.
        """
        text = "This is a sample text without any location keywords."
        sentences = text.split(". ")
        self.assertEqual(extract_unstructured_location(text, sentences), "")
