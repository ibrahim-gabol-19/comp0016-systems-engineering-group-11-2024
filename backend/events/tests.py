"""
This module contains unit tests for the 'events' app.
It tests the views and serializers to ensure they work as expected.
"""

from datetime import date, time
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Event

class EventModelTest(APITestCase):
    """
    Test cases for the Event model.
    """

    def setUp(self):
        """
        Set up the test client and create a test event.
        """
        self.event = Event.objects.create(
            title="Test Event",
            event_type="scheduled",
            description="This is a test event",
            location="Test Location",
            date=date(2023, 10, 1),
            time=time(12, 0, 0),
            is_featured=True
        )

    def test_event_creation(self):
        """
        Test the creation of an Event instance.
        """
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.event_type, "scheduled")
        self.assertEqual(self.event.description, "This is a test event")
        self.assertEqual(self.event.location, "Test Location")
        self.assertEqual(self.event.date.strftime("%Y-%m-%d"), "2023-10-01")
        self.assertEqual(self.event.time.strftime("%H:%M:%S"), "12:00:00")
        self.assertTrue(self.event.is_featured)

class EventsViewSetTest(APITestCase):
    """
    Test cases for the EventViewSet.
    """

    def setUp(self):
        """
        Set up the test client and create test events.
        """
        self.client = APIClient()
        self.event = Event.objects.create(
            title="Test Event",
            event_type="scheduled",
            description="This is a test event",
            location="Test Location",
            date="2023-10-01",
            time="12:00:00",
            is_featured=True
        )
        self.poi_event = Event.objects.create(
            title="Test POI",
            event_type="point_of_interest",
            description="This is a test POI",
            location="Test Location",
            opening_times="9:00 AM - 5:00 PM",
            poi_type="landmarks",
            is_featured=False
        )

    def test_list_events(self):
        """
        Test the EventViewSet list view.
        """
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_scheduled_events(self):
        """
        Test the EventViewSet scheduled events view.
        """
        url = reverse('event-scheduled')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("2023-10-01", response.data)

    def test_pois_events(self):
        """
        Test the EventViewSet POIs events view.
        """
        url = reverse('event-pois')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("landmarks", response.data)

    def test_featured_events(self):
        """
        Test the EventViewSet featured events view.
        """
        url = reverse('event-featured')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "Test Event")

    def test_search_events(self):
        """
        Test the EventViewSet search events view.
        """
        url = reverse('event-search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_event_detail(self):
        """
        Test the EventViewSet detail view.
        """
        url = reverse('event-detail', args=[self.event.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Event")

    def test_create_event(self):
        """
        Test the EventViewSet create event view.
        """
        url = reverse('event-list')
        data = {
            "title": "New Event",
            "event_type": "scheduled",
            "description": "New Event Description",
            "location": "New Location",
            "date": "2023-11-01",
            "time": "14:00:00",
            "is_featured": False
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 3)

    def test_update_event(self):
        """
        Test the EventViewSet update event view.
        """
        url = reverse('event-detail', args=[self.event.id])
        data = {
            "title": "Updated Event",
            "event_type": "scheduled",
            "description": "Updated Event Description",
            "location": "Updated Location",
            "date": "2023-10-01",
            "time": "12:00:00",
            "is_featured": True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Updated Event")

    def test_delete_event(self):
        """
        Test the EventViewSet delete event view.
        """
        url = reverse('event-detail', args=[self.event.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Event.objects.count(), 1)
