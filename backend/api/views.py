import os
import re
import spacy
from datetime import datetime
from ics import Calendar
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.files.storage import FileSystemStorage
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from collections import Counter
import fitz  # PyMuPDF for PDF processing

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

class ItemViewSet(ViewSet):
    """
    Example ViewSet for handling item-related operations.
    """
    def list(self, request):
        # Example logic for returning items
        items = [{"id": 1, "name": "Sample Item"}, {"id": 2, "name": "Another Item"}]
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
    except Exception as e:
        print(f"Error checking PDF structure: {e}")
    return False


def extract_structured_event_title(text):
    match = re.search(r'Title:\s*(.+?)(?=\n(?:Date:|Time:|Description:|Location:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_structured_article_title(text):
    match = re.search(r'Title:\s*(.+?)(?=\n(?:Description:|Main Content:|Author:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""


def extract_structured_date(text):
    match = re.search(
        r'Date:\s*(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*)?'
        r'(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{2}/\d{2}/\d{4})',
        text,
        re.IGNORECASE,
    )
    return normalise_date(match.group(1).strip()) if match else ""

def extract_structured_time(text):
    match = re.search(r'Time:\s*([\d:]+(?:\s*[APap][Mm])?)', text)
    return normalise_time(match.group(1).strip()) if match else ""

def extract_structured_event_description(text):
    match = re.search(r'Description:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Location:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_structured_article_description(text):
    match = re.search(r'Description:\s*(.+?)(?=\n(?:Title:|Main Content:|Author:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_structured_location(text):
    match = re.search(r'Location:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Description:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_structured_main_content(text):
    match = re.search(r'Main Content:\s*(.+?)(?=\n(?:Title:|Description:|Author:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""

def extract_structured_author(text):

    match = re.search(r'Author:\s*(.+?)(?=\n(?:Title:|Description:|Main Content:|$))', 
                      text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else ""    


def extract_unstructured_title(sentences):
    first_line = sentences[0] if sentences else ""
    first_paragraph = " ".join(sentences[:2])  
    return first_line if len(first_line.split()) > 3 else first_paragraph

def extract_unstructured_date(text):
    """
    Extracts a date from unstructured text and normalises it.

    This function searches for a date in the given text. The date can be in the format
    "dd Month yyyy" (e.g., "12th January 2023") or "dd/mm/yyyy" (e.g., "12/01/2023").
    Optionally, the date can be preceded by a day of the week (e.g., "Monday 12th January 2023").

    Args:
        text (str): The unstructured text from which to extract the date.

    Returns:
        str: The normalised date string if a date is found, otherwise an empty string.
    """
    match = re.search(
        r'\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*'
        r'(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\d{1,2}/\d{1,2}/\d{4})\b',
        text,
        re.IGNORECASE
    )
    return normalise_date(match.group(1).strip()) if match else ""

def extract_unstructured_time(text):
    match = re.search(r'\b\d{1,2}:\d{2}(?:\s*[APap][Mm])?\b', text)
    return normalise_time(match.group(0).strip()) if match else ""

def extract_unstructured_location(full_text, sentences):
    """
    Extract the location from unstructured text using NLP and regex.
    
    Args:
        full_text (str): The full text extracted from the PDF.
        sentences (list): List of sentences extracted from the text.

    Returns:
        str: The extracted location.
    """
    # **NLP-Based Location Extraction**
    doc_nlp = nlp(full_text)
    location_entities = [ent.text for ent in doc_nlp.ents if ent.label_ in ["GPE", "FAC", "ORG"]]

    location = ""
    if location_entities:
        location = " ".join(location_entities)  # Combine multiple location-related entities

    # **Backup: Regex-Based Location Extraction**
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
                if keyword in sentence.lower():
                    location_start = sentence.lower().index(keyword) + len(keyword)
                    location = sentence[location_start:].strip()

                    # Check if next sentence continues location
                    if i + 1 < len(sentences):
                        next_sentence = sentences[i + 1]
                        if len(next_sentence.split()) < 10:
                            location += " " + next_sentence.strip()
                    break

    # **Post-processing: Remove Unwanted Prefixes**
    if location:
        location = re.sub(
            r'^(at the|located at|the venue is|the location is|venue address|event location|where is|where:|join us at|hosted at|held at|happening at|taking place at)\s*',
            '', location, flags=re.IGNORECASE
        ).strip()

    return location

def extract_unstructured_description(text):
    """
    Extracts the description from an unstructured PDF.
    """
    return "\n\n".join(paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip())

def extract_unstructured_main_content(text):
    """
    Extracts the main content from an unstructured PDF.
    """
    return text.strip()

def extract_unstructured_author(text):
    """
    Extract author name from unstructured text.
    - First, use regex to find clear author patterns.
    - If regex fails, use spaCy NLP but ensure the name appears early or late in the text.
    """

    author_patterns = [
        r'\b[Bb]y\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "By John Doe"
        r'\b[Bb]yline:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Byline: Jane Smith"
        r'\b[Bb]y:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "By: Alice Brown"
        r'\b[Aa]rticle\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Article by Alex Green"
        r'\b[Rr]eported\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Reported by Anna Johnson"
        r'\b[Cc]ontributed\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Contributed by Emily White"
        r'\b[Ee]ditor:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Editor: Michael Brown"
        r'\b[Pp]ublished\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Published by Daniel Grey"
        r'\b[Rr]eport\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',  # "Report by Sarah Black"
        r'\b[Ss]tory\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'  # "Story by Chris Redfield"
    ]

    # Try regex extraction first
    for pattern in author_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()

    # Fallback: Use spaCy NLP for named entity recognition (NER)
    doc_nlp = nlp(text)
    text_length = len(text)

    for ent in doc_nlp.ents:
        if ent.label_ == "PERSON":
            pos = text.find(ent.text)
            # Ensure the entity appears either at the start (first 300 chars) or end (last 300 chars)
            if pos < 300 or (text_length > 300 and pos > text_length - 300):
                return ent.text.strip()

    # If no author is found, return an empty string
    return ""    


def extract_event_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract event details and images from any type of PDF (structured, unstructured, or semi-structured).
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
            for page_num, page in enumerate(doc, start=1):
                full_text += page.get_text() + "\n"

                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"event_image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)

                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    data['images'].append(image_filename)

        sentences = [sent.strip() for sent in full_text.split("\n") if sent.strip()]

        structured_fields = {
            'title': extract_structured_event_title(full_text),
            'date_of_event': extract_structured_date(full_text),
            'time_of_event': extract_structured_time(full_text),
            'description': extract_structured_event_description(full_text),
            'location': extract_structured_location(full_text)
        }

        # Fill extracted structured fields, then use unstructured extraction if needed
        data['title'] = structured_fields['title'] or extract_unstructured_title(sentences)
        data['date_of_event'] = structured_fields['date_of_event'] or extract_unstructured_date(full_text)
        data['time_of_event'] = structured_fields['time_of_event'] or extract_unstructured_time(full_text)
        data['description'] = structured_fields['description'] or extract_unstructured_description(full_text)
        data['location'] = structured_fields['location'] or extract_unstructured_location(full_text, sentences)

    except Exception as e:
        print(f"Error extracting event data: {e}")
        data = {key: '' for key in data}
        data['images'] = []

    return data


def extract_article_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract article details and images from any type of PDF (structured, unstructured, or semi-structured).
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
            for page_num, page in enumerate(doc, start=1):
                full_text += page.get_text() + "\n"

                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"article_image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)

                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)

                    data['images'].append(image_filename)

        sentences = [sent.strip() for sent in full_text.split("\n") if sent.strip()]

        structured_fields = {
            'title': extract_structured_article_title(full_text),
            'description': extract_structured_article_description(full_text),
            'main_content': extract_structured_main_content(full_text),
            'author': extract_structured_author(full_text)
        }

        # Fill extracted structured fields, then use unstructured extraction if needed
        data['title'] = structured_fields['title'] or extract_unstructured_title(sentences)
        data['description'] = structured_fields['description'] or extract_unstructured_description(full_text)
        data['main_content'] = structured_fields['main_content'] or extract_unstructured_main_content(full_text)
        data['author'] = structured_fields['author'] or extract_unstructured_author(full_text)

    except Exception as e:
        print(f"Error extracting article data: {e}")
        data = {key: '' for key in data}
        data['images'] = []  # Reset images field
        data['date'] = datetime.now().strftime('%d/%m/%Y')

    return data

def extract_event_data_ics(ics_path):
    """
    Extract event details from an .ics file.

    Args:
        ics_path (str): Path to the input .ics file.

    Returns:
        dict: A dictionary containing extracted event details.
    """
    data = {
        'title': '',
        'date_of_event': '',
        'time_of_event': '',
        'description': '',
        'location': ''
    }

    try:
        # Read and preprocess the .ics file to handle multi-line descriptions
        with open(ics_path, 'r', encoding='utf-8') as file:
            raw_content = file.read()

        # Preprocess content to fix multi-line fields
        processed_content = preprocess_ics_content(raw_content)
        calendar = Calendar(processed_content)

        # Assume the first event in the .ics file is the one we want to process
        event = next(iter(calendar.events), None)
        if not event:
            return {'error': 'No events found in the .ics file'}

        # Extract title
        data['title'] = event.name or ''

        # Extract description
        data['description'] = clean_description_ics(event.description) or ''

        # Extract start time and normalize date and time
        if event.begin:
            data['date_of_event'] = normalise_date(event.begin.format('DD MMMM YYYY'))
            data['time_of_event'] = normalise_time(event.begin.format('hh:mm A'))

        # Extract location
        data['location'] = event.location or ''

    except Exception as e:
        print(f"Error extracting event data from .ics file: {e}")
        data = {key: '' for key in data}  # Reset all fields to empty if an error occurs

    return data


def preprocess_ics_content(raw_content):
    """
    Preprocess the raw .ics file content to merge multi-line property values.

    Args:
        raw_content (str): The raw content of the .ics file.

    Returns:
        str: Processed .ics content with multi-line values merged.
    """
    # Merge continuation lines (lines starting with a space) into the previous line
    processed_content = re.sub(r'\n[ \t]', '', raw_content)
    return processed_content


def clean_description_ics(description):
    """
    Remove unwanted characters like newlines and extra spaces from the description.
    """
    # Remove extra newlines and normalize spaces
    description = re.sub(r'\s+', ' ', description)
    return description.strip()

def normalise_date(raw_date):
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


def normalise_time(raw_time):
    """Convert various time formats to 24-hour clock (e.g., 18:30)."""
    try:
        # Pre-normalise the input for variations in AM/PM (e.g., "5pm" -> "5 PM")
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


@csrf_exempt  # Use only for testing; configure properly in production
def upload_pdf_and_extract_data(request, pdf_type):
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

            # Clean up the file after processing
            if os.path.exists(pdf_path):
                os.remove(pdf_path)

            return JsonResponse(extracted_data)
        except Exception as e:
            return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt  # Use only for testing; configure properly in production
def upload_ics_and_extract_event_data(request):
    """
    Handle the upload of an .ics file and extract event details from it.
    On GET, serve the HTML test page.
    """
    if request.method == 'GET':
        # Serve the HTML test page
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

            # Extract event data from the .ics file
            extracted_data = extract_event_data_ics(ics_path)

            # Clean up the file after processing
            if os.path.exists(ics_path):
                os.remove(ics_path)

            return JsonResponse(extracted_data)
        except Exception as e:
            return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
