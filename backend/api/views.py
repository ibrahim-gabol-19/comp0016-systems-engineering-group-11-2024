import os
import re
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
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
            elif pdf_type == "article":
                extracted_data = extract_article_data(pdf_path)    

            # Clean up the file after processing
            if os.path.exists(pdf_path):
                os.remove(pdf_path)

            return JsonResponse(extracted_data)
        except Exception as e:
            return JsonResponse({'error': f"Error processing file: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)