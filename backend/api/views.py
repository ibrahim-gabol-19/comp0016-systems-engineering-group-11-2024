import os
import re
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
import fitz  # PyMuPDF for PDF processing


class ItemViewSet(ViewSet):
    """
    Example ViewSet for handling item-related operations.
    """
    def list(self, request):
        # Example logic for returning items
        items = [{"id": 1, "name": "Sample Item"}, {"id": 2, "name": "Another Item"}]
        return Response(items)


def extract_event_data(pdf_path):
    """Extract event details from the content of a PDF file."""
    data = {
        'title': '',
        'date_of_event': '',
        'time_of_event': '',
        'description': '',
        'location': ''
    }

    try:
        with fitz.open(pdf_path) as doc:
            text = ""
            for page in doc:
                text += page.get_text()

        # Extract and normalize title
        title_match = re.search(r'Title:\s*(.+)', text, re.IGNORECASE)
        data['title'] = title_match.group(1).strip() if title_match else ""

        # Extract and normalize date
        date_match = re.search(
            r'Date:\s*(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*)?'
            r'(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{2}/\d{2}/\d{4})',
            text,
            re.IGNORECASE,
        )
        if date_match:
            raw_date = date_match.group(1).strip()
            data['date_of_event'] = normalize_date(raw_date)
        else:
            data['date_of_event'] = ""

        # Extract and normalize time
        time_match = re.search(r'Time:\s*([\d:]+(?:\s*[APap][Mm])?)', text)
        if time_match:
            raw_time = time_match.group(1).strip()
            data['time_of_event'] = normalize_time(raw_time)
        else:
            data['time_of_event'] = ""

        # Extract description
        description_match = re.search(r'Description:\s*(.+)', text, re.IGNORECASE)
        data['description'] = description_match.group(1).strip() if description_match else ""

        # Extract location
        location_match = re.search(r'Location:\s*(.+)', text, re.IGNORECASE)
        data['location'] = location_match.group(1).strip() if location_match else ""

    except Exception as e:
        # Log the exception and reset all fields to empty strings
        print(f"Error extracting event data: {e}")
        data = {key: "" for key in data}

    return data


def normalize_date(raw_date):
    """Convert various date formats to dd/mm/yyyy."""
    try:
        # Handle formats like "Saturday 4th January 2025" or "4 January 2025"
        date_obj = datetime.strptime(
            re.sub(r"(st|nd|rd|th)", "", raw_date, flags=re.IGNORECASE), "%d %B %Y"
        )
        return date_obj.strftime("%d/%m/%Y")
    except ValueError:
        try:
            # Handle formats like "04/01/2025"
            date_obj = datetime.strptime(raw_date, "%d/%m/%Y")
            return date_obj.strftime("%d/%m/%Y")
        except ValueError:
            return ""


def normalize_time(raw_time):
    """Convert various time formats to 24-hour clock (e.g., 18:30)."""
    try:
        # Pre-normalize the input for variations in AM/PM (e.g., "5pm" -> "5 PM")
        raw_time = re.sub(r"(\d)([APap][Mm])", r"\1 \2", raw_time.strip())
        raw_time = raw_time.upper()  # Ensure AM/PM is in uppercase for parsing

        # Handle formats like "5 PM" or "5:30 PM"
        time_obj = datetime.strptime(raw_time, "%I %p")
        return time_obj.strftime("%H:%M")
    except ValueError:
        try:
            time_obj = datetime.strptime(raw_time, "%I:%M %p")
            return time_obj.strftime("%H:%M")
        except ValueError:
            try:
                # Handle formats like "17:00"
                time_obj = datetime.strptime(raw_time, "%H:%M")
                return time_obj.strftime("%H:%M")
            except ValueError:
                return ""


def upload_pdf(request):
    """Handle PDF file uploads, extract event data, and return JSON response."""
    if request.method == 'POST' and request.FILES.get('pdf_file'):
        pdf_file = request.FILES['pdf_file']
        fs = FileSystemStorage()
        filename = fs.save(pdf_file.name, pdf_file)
        pdf_path = fs.path(filename)

        # Extract event data
        event_data = extract_event_data(pdf_path)

        # Delete the PDF after processing
        os.remove(pdf_path)

        return JsonResponse(event_data)

    return render(request, 'events/create_event.html')





