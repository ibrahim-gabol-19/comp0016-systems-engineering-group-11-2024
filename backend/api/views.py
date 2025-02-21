"""
Django views for handling PDF and ICS file uploads and extracting structured data.
"""

import os
import re
from datetime import datetime

import spacy
from ics import Calendar
import fitz  # PyMuPDF for PDF processing
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

# Load spaCy model
nlp = spacy.load("en_core_web_sm")


class ItemViewSet(ViewSet):
    """
    Example ViewSet for handling item-related operations.
    """

    def list(self, request):
        """
        Example logic for returning items.
        """
        items = [
            {"id": 1, "name": "Sample Item"},
            {"id": 2, "name": "Another Item"}
        ]
        return Response(items)


def is_structured_pdf(pdf_path):
    """
    Determine whether the PDF is structured by checking for specific field keywords.
    """
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text = page.get_text()
                if any(keyword in text.lower() for keyword in
                       ['title', 'date', 'time', 'location', 'description']):
                    return True
    except fitz.FileDataError as e:
        print(f"Error checking PDF structure: {e}")
    return False


def extract_structured_event_title(text):
    """
    Extract the title from structured event text.
    """
    match = re.search(
        r'Title:\s*(.+?)(?=\n(?:Date:|Time:|Description:|Location:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_article_title(text):
    """
    Extract the title from structured article text.
    """
    match = re.search(
        r'Title:\s*(.+?)(?=\n(?:Description:|Main Content:|Author:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_date(text):
    """
    Extract the date from structured text.
    """
    match = re.search(
        r'Date:\s*(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*)?'
        r'(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{2}/\d{2}/\d{4})',
        text, re.IGNORECASE
    )
    return normalise_date(match.group(1).strip()) if match else ""


def extract_structured_time(text):
    """
    Extract the time from structured text.
    """
    match = re.search(r'Time:\s*([\d:]+(?:\s*[APap][Mm])?)', text)
    return normalise_time(match.group(1).strip()) if match else ""


def extract_structured_event_description(text):
    """
    Extract the description from structured event text.
    """
    match = re.search(
        r'Description:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Location:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_article_description(text):
    """
    Extract the description from structured article text.
    """
    match = re.search(
        r'Description:\s*(.+?)(?=\n(?:Title:|Main Content:|Author:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_location(text):
    """
    Extract the location from structured text.
    """
    match = re.search(
        r'Location:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Description:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_main_content(text):
    """
    Extract the main content from structured text.
    """
    match = re.search(
        r'Main Content:\s*(.+?)(?=\n(?:Title:|Description:|Author:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_structured_author(text):
    """
    Extract the author from structured text.
    """
    match = re.search(
        r'Author:\s*(.+?)(?=\n(?:Title:|Description:|Main Content:|$))',
        text, re.IGNORECASE | re.DOTALL
    )
    return match.group(1).strip() if match else ""


def extract_unstructured_title(sentences):
    """
    Extract the title from unstructured text.
    """
    first_line = sentences[0] if sentences else ""
    first_paragraph = " ".join(sentences[:2])
    return first_line if len(first_line.split()) > 3 else first_paragraph


def extract_unstructured_date(text):
    """
    Extract the date from unstructured text.
    """
    match = re.search(
        r'\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*'
        r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|'
        r'July|August|September|October|November|December)\s+\d{4}|\d{1,2}/\d{1,2}/\d{4})\b',
        text, re.IGNORECASE
    )
    return normalise_date(match.group(1).strip()) if match else ""


def extract_unstructured_time(text):
    """
    Extract the time from unstructured text.
    """
    match = re.search(r'\b\d{1,2}:\d{2}(?:\s*[APap][Mm])?\b', text)
    return normalise_time(match.group(0).strip()) if match else ""


def extract_unstructured_location(full_text, sentences):
    """
    Extract the location from unstructured text using NLP and regex.
    """
    doc_nlp = nlp(full_text)
    location_entities = [
        ent.text for ent in doc_nlp.ents if ent.label_ in ["GPE", "FAC", "ORG"]
    ]

    location = ""
    if location_entities:
        location = " ".join(location_entities)

    if not location:
        location_keywords = [
            "venue:", "address:", "location:", "find us at:", "event will take place at:",
            "the event is taking place at", "the venue is:", "the location is:", "event location:",
            "venue address:", "located at:", "happening at:", "taking place at:", "where:",
            "meet us at:", "our event will be at:", "the venue for this event is:", "come to:",
            "you'll find us at:", "visit us at:", "join us at:", "the event is scheduled at:",
            "held at:", "hosted at:", "takes place at:", "we are gathering at:",
            "this event is being held at:", "the address for this event is:",
            "this event is set to be at:", "gather with us at:"
        ]

        for i, sentence in enumerate(sentences):
            for keyword in location_keywords:
                if keyword not in sentence.lower():
                    continue  # Skip to the next keyword if not found

                location_start = sentence.lower().index(keyword) + len(keyword)
                location = sentence[location_start:].strip()

                if i + 1 < len(sentences):
                    next_sentence = sentences[i + 1]
                    if len(next_sentence.split()) < 10:
                        location += " " + next_sentence.strip()
                break  # Exit the keyword loop after finding a match

    if location:
        location = re.sub(
            r'^(at the|located at|the venue is|the location is|venue address|event location|'
            r'where is|where:|join us at|hosted at|held at|happening at|taking place at)\s*',
            '', location, flags=re.IGNORECASE
        ).strip()

    return location


def extract_unstructured_description(text):
    """
    Extract the description from unstructured text.
    """
    return "\n\n".join(paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip())


def extract_unstructured_main_content(text):
    """
    Extract the main content from unstructured text.
    """
    return text.strip()


def extract_unstructured_author(text):
    """
    Extract the author from unstructured text.
    """
    author_patterns = [
        r'\b[Bb]y\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Bb]yline:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Bb]y:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Aa]rticle\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Rr]eported\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Cc]ontributed\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Ee]ditor:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Pp]ublished\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Rr]eport\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        r'\b[Ss]tory\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
    ]

    for pattern in author_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()

    doc_nlp = nlp(text)
    text_length = len(text)

    for ent in doc_nlp.ents:
        if ent.label_ == "PERSON":
            pos = text.find(ent.text)
            if pos < 300 or (text_length > 300 and pos > text_length - 300):
                return ent.text.strip()

    return ""


def extract_event_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract event details and images from any type of PDF.
    """
    data = {
        'title': '',
        'date_of_event': '',
        'time_of_event': '',
        'description': '',
        'location': '',
        'images': []
    }

    try:
        with fitz.open(pdf_path) as doc:
            full_text = ""
            for page in doc:
                full_text += page.get_text() + "\n"

                for img in page.get_images(full=True):
                    base_image = doc.extract_image(img[0])
                    image_name = f"event_image_page{page.number + 1}_{img[0]}.{base_image['ext']}"
                    os.makedirs(output_image_dir, exist_ok=True)

                    with open(os.path.join(output_image_dir, image_name), "wb") as f:
                        f.write(base_image["image"])

                    data['images'].append(image_name)

        sentences = [sent.strip() for sent in full_text.split("\n") if sent.strip()]

        structured_fields = {
            'title': extract_structured_event_title(full_text),
            'date_of_event': extract_structured_date(full_text),
            'time_of_event': extract_structured_time(full_text),
            'description': extract_structured_event_description(full_text),
            'location': extract_structured_location(full_text)
        }

        for field, extractor in {
            'title': lambda: extract_unstructured_title(sentences),
            'date_of_event': lambda: extract_unstructured_date(full_text),
            'time_of_event': lambda: extract_unstructured_time(full_text),
            'description': lambda: extract_unstructured_description(full_text),
            'location': lambda: extract_unstructured_location(full_text, sentences)
        }.items():
            data[field] = structured_fields[field] or extractor()

    except fitz.FileDataError as e:
        print(f"Error extracting event data: {e}")
        data = {key: '' for key in data}
        data['images'] = []

    return data

def extract_article_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract article details and images from any type of PDF.
    """
    data = {
        'title': '',
        'description': '',
        'main_content': '',
        'author': '',
        'images': [],
        'date': datetime.now().strftime('%d/%m/%Y')
    }

    try:
        with fitz.open(pdf_path) as doc:
            full_text = ""
            for page in doc:
                full_text += page.get_text() + "\n"

                for img in page.get_images(full=True):
                    base_image = doc.extract_image(img[0])
                    image_name = f"event_image_page{page.number + 1}_{img[0]}.{base_image['ext']}"
                    os.makedirs(output_image_dir, exist_ok=True)

                    with open(os.path.join(output_image_dir, image_name), "wb") as f:
                        f.write(base_image["image"])

                    data['images'].append(image_name)

        sentences = [sent.strip() for sent in full_text.split("\n") if sent.strip()]

        structured_fields = {
            'title': extract_structured_article_title(full_text),
            'description': extract_structured_article_description(full_text),
            'main_content': extract_structured_main_content(full_text),
            'author': extract_structured_author(full_text)
        }

        for field, extractor in {
            'title': lambda: extract_unstructured_title(sentences),
            'description': lambda: extract_unstructured_description(full_text),
            'main_content': lambda: extract_unstructured_main_content(full_text),
            'author': lambda: extract_unstructured_author(full_text)
        }.items():
            data[field] = structured_fields[field] or extractor()

    except fitz.FileDataError as e:
        print(f"Error extracting article data: {e}")
        data = {key: '' for key in data}
        data['images'] = []
        data['date'] = datetime.now().strftime('%d/%m/%Y')

    return data


def extract_event_data_ics(ics_path):
    """
    Extract event details from an .ics file.
    """
    data = {
        'title': '',
        'date_of_event': '',
        'time_of_event': '',
        'description': '',
        'location': ''
    }

    try:
        with open(ics_path, 'r', encoding='utf-8') as file:
            raw_content = file.read()

        processed_content = preprocess_ics_content(raw_content)
        calendar = Calendar(processed_content)

        event = next(iter(calendar.events), None)
        if not event:
            return {'error': 'No events found in the .ics file'}

        data['title'] = event.name or ''
        data['description'] = clean_description_ics(event.description) or ''

        if event.begin:
            data['date_of_event'] = normalise_date(event.begin.format('DD MMMM YYYY'))
            data['time_of_event'] = normalise_time(event.begin.format('hh:mm A'))

        data['location'] = event.location or ''

    except (IOError, ValueError) as e:
        print(f"Error extracting event data from .ics file: {e}")
        data = {key: '' for key in data}

    return data


def preprocess_ics_content(raw_content):
    """
    Preprocess the raw .ics file content to merge multi-line property values.
    """
    processed_content = re.sub(r'\n[ \t]', '', raw_content)
    return processed_content


def clean_description_ics(description):
    """
    Clean the description from an .ics file.
    """
    description = re.sub(r'\s+', ' ', description)
    return description.strip()


def normalise_date(raw_date):
    """
    Normalise the date to dd/mm/yyyy format.
    """
    try:
        date_obj = datetime.strptime(
            re.sub(r"(st|nd|rd|th)", "", raw_date, flags=re.IGNORECASE), "%d %B %Y"
        )
        return date_obj.strftime("%d/%m/%Y")
    except ValueError:
        try:
            date_obj = datetime.strptime(raw_date, "%d/%m/%Y")
            return date_obj.strftime("%d/%m/%Y")
        except ValueError:
            return ""


def normalise_time(raw_time):
    """
    Normalise the time to 24-hour format.
    """
    try:
        raw_time = re.sub(r"(\d)([APap][Mm])", r"\1 \2", raw_time.strip())
        raw_time = raw_time.upper()

        time_obj = datetime.strptime(raw_time, "%I %p")
        return time_obj.strftime("%H:%M")
    except ValueError:
        try:
            time_obj = datetime.strptime(raw_time, "%I:%M %p")
            return time_obj.strftime("%H:%M")
        except ValueError:
            try:
                time_obj = datetime.strptime(raw_time, "%H:%M")
                return time_obj.strftime("%H:%M")
            except ValueError:
                return ""


@csrf_exempt
def upload_pdf_and_extract_data(request, pdf_type):
    """
    Handle PDF file upload and extract data based on the type (event or article).
    """
    if request.method == 'POST' and request.FILES.get('pdf_file'):
        try:
            pdf_file = request.FILES['pdf_file']
            fs = FileSystemStorage()
            filename = fs.save(pdf_file.name, pdf_file)
            pdf_path = fs.path(filename)

            if pdf_type == 'event':
                extracted_data = extract_event_data(pdf_path)
            elif pdf_type == 'article':
                extracted_data = extract_article_data(pdf_path)
            else:
                return JsonResponse({'error': 'Invalid pdf_type'}, status=400)

            if os.path.exists(pdf_path):
                os.remove(pdf_path)

            return JsonResponse(extracted_data)
        except (IOError, ValueError) as e:
            return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def upload_ics_and_extract_event_data(request):
    """
    Handle .ics file upload and extract event data.
    """
    if request.method == 'GET':
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Upload ICS File</title>
        </head>
        <body>
          <h1>Upload ICS File and Extract Event Data</h1>
          <form id="uploadForm" enctype="multipart/form-data">
            <label for="icsFile">Select .ics File:</label>
            <input type="file" id="icsFile" name="ics_file" accept=".ics" required>
            <button type="submit">Upload and Extract</button>
          </form>
          <h2>Extracted Event Data:</h2>
          <pre id="output"></pre>
          <script>
            document.getElementById('uploadForm').addEventListener('submit', async function (event) {
              event.preventDefault();
              const fileInput = document.getElementById('icsFile');
              if (!fileInput.files.length) {
                alert('Please select a file to upload!');
                return;
              }
              const formData = new FormData();
              formData.append('ics_file', fileInput.files[0]);
              try {
                const response = await fetch('http://127.0.0.1:8000/api/upload_ics/', {
                  method: 'POST',
                  body: formData,
                  headers: { 'X-CSRFToken': getCookie('csrftoken') }
                });
                const data = await response.json();
                if (response.ok) {
                  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
                } else {
                  document.getElementById('output').textContent = `Error: ${data.error || 'Unknown error'}`;
                }
              } catch (err) {
                document.getElementById('output').textContent = `Error: ${err.message}`;
              }
            });
            function getCookie(name) {
              let cookieValue = null;
              if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                  const cookie = cookies[i].trim();
                  if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                  }
                }
              }
              return cookieValue;
            }
          </script>
        </body>
        </html>
        """
        return HttpResponse(html_content, content_type="text/html")

    if request.method == 'POST' and request.FILES.get('ics_file'):
        try:
            ics_file = request.FILES['ics_file']
            fs = FileSystemStorage()
            filename = fs.save(ics_file.name, ics_file)
            ics_path = fs.path(filename)

            extracted_data = extract_event_data_ics(ics_path)

            if os.path.exists(ics_path):
                os.remove(ics_path)

            return JsonResponse(extracted_data)
        except (IOError, ValueError) as e:
            return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
