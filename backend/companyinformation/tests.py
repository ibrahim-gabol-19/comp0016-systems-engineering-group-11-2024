"""
This module contains unit tests for the 'companyinformation' app.
It tests the views and serializers to ensure they work as expected.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CompanyInformation
from .views import create_default_company

class CompanyInformationModelTest(TestCase):
    """
    Test cases for the CompanyInformation model.
    """

    def setUp(self):
        # Ensure no CompanyInformation instance exists before each test
        CompanyInformation.objects.all().delete()

    def test_singleton_pattern(self):
        """
        Ensure that only one instance of CompanyInformation can exist.
        """
        # Create the first instance
        CompanyInformation.objects.create(
            name="Test Company",
            about="This is a test company.",
            main_color="#FF5733",
            font="Arial",
            sw_lat=51.341875,
            sw_lon=-0.29222,
            ne_lat=51.651675,
            ne_lon=0.01758,
        )

        # Attempt to create a second instance
        with self.assertRaises(ValueError):
            CompanyInformation.objects.create(
                name="Another Company",
                about="This should not be allowed.",
                main_color="#000000",
                font="Times New Roman",
                sw_lat=51.341875,
                sw_lon=-0.29222,
                ne_lat=51.651675,
                ne_lon=0.01758,
            )

    def test_str_representation(self):
        """
        Test the string representation of the CompanyInformation model.
        """
        company = CompanyInformation.objects.create(
            name="Test Company",
            about="This is a test company.",
            main_color="#FF5733",
            font="Arial",
            sw_lat=51.341875,
            sw_lon=-0.29222,
            ne_lat=51.651675,
            ne_lon=0.01758,
        )
        self.assertEqual(str(company), "Test Company")


class CompanyInformationViewSetTest(TestCase):
    """
    Test cases for the CompanyInformationViewSet.
    """

    def setUp(self):
        """
        Set up the test client and create a test company.
        """
        self.client = APIClient()
        # Ensure no CompanyInformation instance exists before each test
        CompanyInformation.objects.all().delete()
        self.company = CompanyInformation.objects.create(
            name="Test Company",
            about="This is a test company.",
            main_color="#FF5733",
            font="Arial",
            sw_lat=51.341875,
            sw_lon=-0.29222,
            ne_lat=51.651675,
            ne_lon=0.01758,
        )
        self.url = reverse('companyinformation-list')

    def test_get_company_information(self):
        """
        Test retrieving company information.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Test Company")

    def test_update_company_information(self):
        """
        Test updating company information.
        """
        updated_data = {
            "name": "Updated Company",
            "about": "This is an updated company.",
            "main_color": "#000000",
            "font": "Times New Roman",
            "sw_lat": 51.341875,
            "sw_lon": -0.29222,
            "ne_lat": 51.651675,
            "ne_lon": 0.01758,
        }
        response = self.client.put(f"{self.url}{self.company.id}/", updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.company.refresh_from_db()
        self.assertEqual(self.company.name, "Updated Company")


class CreateDefaultCompanyTest(TestCase):
    """
    Test cases for the create_default_company function.
    """

    def setUp(self):
        # Ensure no CompanyInformation instance exists before each test
        CompanyInformation.objects.all().delete()

    def test_create_default_company(self):
        """
        Test that the default company is created when no company exists.
        """
        # Ensure no company exists initially
        self.assertEqual(CompanyInformation.objects.count(), 0)

        # Call the function to create the default company
        create_default_company()

        # Verify that the default company was created
        self.assertEqual(CompanyInformation.objects.count(), 1)
        company = CompanyInformation.objects.first()
        self.assertEqual(company.name, "Example Company")

    def test_create_default_company_when_company_exists(self):
        """
        Test that the default company is not created if a company already exists.
        """
        # Create a company manually
        CompanyInformation.objects.create(
            name="Existing Company",
            about="This is an existing company.",
            main_color="#FF5733",
            font="Arial",
            sw_lat=51.341875,
            sw_lon=-0.29222,
            ne_lat=51.651675,
            ne_lon=0.01758,
        )

        # Call the function to create the default company
        create_default_company()

        # Verify that no additional company was created
        self.assertEqual(CompanyInformation.objects.count(), 1)
        company = CompanyInformation.objects.first()
        self.assertEqual(company.name, "Existing Company")
