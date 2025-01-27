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
                if any(keyword in text.lower() for keyword in ['title', 'date', 'time', 'location', 'description']):
                    return True
    except Exception as e:
        print(f"Error checking PDF structure: {e}")
    return False


def extract_event_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract event details and images from the content of a PDF file.
    
    Args:
        pdf_path (str): Path to the input PDF file.
        output_image_dir (str): Directory to save extracted images.

    Returns:
        dict: A dictionary containing extracted event details and images.
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
            text = ""
            for page_num, page in enumerate(doc, start=1):
                # Extract text
                text += page.get_text()

                # Extract images
                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    # Create output directory for images
                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"event_image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)

                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    data['images'].append(image_filename)

        # Extract and normalise fields
        title_match = re.search(r'Title:\s*(.+?)(?=\n(?:Date:|Time:|Description:|Location:|$))', text, re.IGNORECASE | re.DOTALL)
        data['title'] = title_match.group(1).strip() if title_match else ""

        date_match = re.search(
            r'Date:\s*(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*)?'
            r'(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{2}/\d{2}/\d{4})',
            text,
            re.IGNORECASE,
        )
        if date_match:
            raw_date = date_match.group(1).strip()
            data['date_of_event'] = normalise_date(raw_date)
        else:
            data['date_of_event'] = ""

        time_match = re.search(r'Time:\s*([\d:]+(?:\s*[APap][Mm])?)', text)
        if time_match:
            raw_time = time_match.group(1).strip()
            data['time_of_event'] = normalise_time(raw_time)
        else:
            data['time_of_event'] = ""

        # Extract description by finding "Description:" and capturing until the next key
        description_match = re.search(r'Description:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Location:|$))', text, re.IGNORECASE | re.DOTALL)
        data['description'] = description_match.group(1).strip() if description_match else ""

        # Extract location by finding "Location:" and capturing until the next key
        location_match = re.search(r'Location:\s*(.+?)(?=\n(?:Title:|Date:|Time:|Description:|$))', text, re.IGNORECASE | re.DOTALL)
        data['location'] = location_match.group(1).strip() if location_match else ""

    except Exception as e:
        print(f"Error extracting event data: {e}")
        data = {key: "" for key in data}
        data['images'] = []  # Ensure images field is reset

    return data

def extract_unstructured_event_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract event details and images from an unstructured PDF file using advanced heuristics and NLP.
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
                full_text += page.get_text()

                # Extract images
                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"event_unstructured_image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)

                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    data['images'].append(image_filename)

        # Process text with heuristics
        sentences = full_text.split("\n")  # Split into lines for easier parsing
        sentences = [sent.strip() for sent in sentences if sent.strip()]  # Clean up empty lines

        # Heuristic for title: First line with significant content
        if sentences:
            first_line = sentences[0]
            first_paragraph = " ".join(sentences[:2])  # Combine the first two lines
            data['title'] = first_line if len(first_line.split()) > 3 else first_paragraph

        # Extract date using enhanced regex and normalise_date function
        date_matches = re.findall(
            r'(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*'
            r'\d{1,2}(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}'
            r'|\d{2}/\d{2}/\d{4}',
            full_text,
            re.IGNORECASE
        )
        for raw_date in date_matches:
            normalised = normalise_date(raw_date.strip())
            if normalised:
                data['date_of_event'] = normalised
                break

        # Extract time using normalise_time function
        time_matches = re.findall(r'\b\d{1,2}:\d{2}(?:\s*[APap][Mm])?\b', full_text)
        for raw_time in time_matches:
            normalised = normalise_time(raw_time.strip())
            if normalised:
                data['time_of_event'] = normalised
                break

        # Extract location using enhanced logic
        location_candidates = []
        for sentence in sentences:
            if re.search(r'\bvenue\b|at\b|location\b|place\b|find us at\b|event will take place at\b', sentence, re.IGNORECASE):
                location_candidates.append(sentence)

        # Discard candidates if they refer to time instead of a location
        for candidate in location_candidates:
            match = re.search(r'(?<=venue[:\s]).*|(?<=at\s).*|(?<=location[:\s]).*|(?<=place[:\s]).*|(?<=will take place at[:\s]).*', candidate, re.IGNORECASE)
            if match:
                extracted_text = match.group().strip()

                # Check if the extracted text is a time
                if not re.search(r'\b\d{1,2}:\d{2}(?:\s*[APap][Mm])?\b|\b\d{1,2}(?:\s*[APap][Mm])\b', extracted_text):
                    data['location'] = extracted_text
                    break

        # Fallback for location if no match is found
        if not data['location']:
            for sentence in sentences:
                if len(sentence.split()) > 3 and not re.search(r'\bdate\b|time\b', sentence, re.IGNORECASE):
                    data['location'] = sentence.strip()
                    break

        # Extract description: Entire event text
        data['description'] = full_text.strip()

    except Exception as e:
        print(f"Error extracting unstructured event data: {e}")
        data = {key: '' for key in data}
        data['images'] = []  # Ensure images field is reset

    return data




def extract_article_data(pdf_path, output_image_dir="media/extracted_images"):
    """Extract article details and images from the content of a PDF file."""
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
            text = ""
            image_counter = 0

            for page_num, page in enumerate(doc, start=1):
                # Extract text content
                text += page.get_text()

                # Extract images
                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]  # Reference to the image
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]  # Image file extension

                    # Save the extracted image to the output directory
                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)
                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    data['images'].append(image_filename)
                    image_counter += 1

            # Extract and normalise title
            title_match = re.search(r'Title:\s*(.+?)(?=\n(?:Description:|Main Content:|Author:|$))', text, re.IGNORECASE | re.DOTALL)
            data['title'] = title_match.group(1).strip() if title_match else ""

            # Extract description
            description_match = re.search(r'Description:\s*(.+?)(?=\n(?:Title:|Main Content:|Author:|$))', text, re.IGNORECASE | re.DOTALL)
            data['description'] = description_match.group(1).strip() if description_match else ""

            # Extract main content
            main_content_match = re.search(r'Main Content:\s*(.+?)(?=\n(?:Title:|Description:|Author:|$))', text, re.IGNORECASE | re.DOTALL)
            data['main_content'] = main_content_match.group(1).strip() if main_content_match else ""

            # Extract author
            author_match = re.search(r'Author:\s*(.+?)(?=\n(?:Title:|Description:|Main Content:|$))', text, re.IGNORECASE | re.DOTALL)
            data['author'] = author_match.group(1).strip() if author_match else ""

    except Exception as e:
        print(f"Error extracting article data: {e}")
        data = {key: None for key in data}
        data['date'] = datetime.now().strftime('%d/%m/%Y')  # Ensure date is always set

    return data

def extract_unstructured_article_data(pdf_path, output_image_dir="media/extracted_images"):
    """
    Extract article details and images from an unstructured PDF file using advanced heuristics and NLP.
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
                full_text += page.get_text()

                # Extract images
                for img_index, img in enumerate(page.get_images(full=True), start=1):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    os.makedirs(output_image_dir, exist_ok=True)
                    image_filename = f"article_unstructured_image_page{page_num}_{img_index}.{image_ext}"
                    image_path = os.path.join(output_image_dir, image_filename)

                    with open(image_path, "wb") as image_file:
                        image_file.write(image_bytes)
                    
                    data['images'].append(image_filename)

        # Process text with spaCy NLP
        doc_nlp = nlp(full_text)
        sentences = [sent.text.strip() for sent in doc_nlp.sents]

        # Heuristic for title: First sentence or paragraph with significant proper nouns
        if sentences:
            first_line = sentences[0]
            first_paragraph = " ".join(sentences[:2])  # Combine the first two sentences
            candidate_title = Counter([token.text for token in nlp(first_paragraph) if token.pos_ in ["NOUN", "PROPN"]])
            data['title'] = first_line if len(candidate_title) > 2 else first_paragraph

        # Extract description: First 300 characters or a summary
        data['description'] = full_text[:300]  # Use the first 300 characters

        # Extract main content: Entire text
        data['main_content'] = full_text

        # Extract author: Look for patterns like "By [Author Name]"
        author_pattern = re.search(r'\b[Bb]y\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)', full_text)
        if author_pattern:
            data['author'] = author_pattern.group(1).strip()

    except Exception as e:
        print(f"Error extracting unstructured article data: {e}")
        data = {key: '' for key in data}
        data['images'] = []  # Ensure images field is reset

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
                extracted_data = extract_event_data(pdf_path) if is_structured_pdf(pdf_path) else extract_unstructured_event_data(pdf_path)
            elif pdf_type == 'article':
                extracted_data = extract_article_data(pdf_path) if is_structured_pdf(pdf_path) else extract_unstructured_article_data(pdf_path)
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