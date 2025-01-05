from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load SentenceTransformer model
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

# Example data for events and news
data = [
    {
        "type": "event",
        "Title": "Christmas Celebration",
        "Description": "A festive gathering to celebrate Christmas.",
        "Main content": "Join us for music, food, and games.",
        "Date": "25th December",
        "Time": "5 PM",
        "Location": "Central Park",
        "Contact info": "events@holidayfun.com",
    },
    {
        "type": "event",
        "Title": "Winter Marathon",
        "Description": "A charity run to support local shelters.",
        "Main content": "Participants will run through scenic winter paths.",
        "Date": "15th January",
        "Time": "9 AM",
        "Location": "Hyde Park",
        "Contact info": "contact@wintermarathon.com",
    },
        {
        "type": "event",
        "Title": "Summer Marathon",
        "Description": "A charity run to support local shelters.",
        "Main content": "Participants will run through scenic summer paths.",
        "Date": "21st June",
        "Time": "11 AM",
        "Location": "Trail",
        "Contact info": "contact@summermarathon.com",
    },
    {
        "type": "news",
        "Title": "Record Snowfall in Paris",
        "Description": "Paris experiences heaviest snowfall in decades.",
        "Main content": "The city is covered in a thick blanket of snow, disrupting transportation.",
        "Date published": "10th December",
        "Author": "Jane Doe",
    },
    {
        "type": "news",
        "Title": "New Year Fireworks",
        "Description": "Cities worldwide welcome the New Year with fireworks.",
        "Main content": "Major cities light up the sky with dazzling fireworks displays.",
        "Date published": "1st January",
        "Author": "John Smith",
    },
]

# Preprocess data by combining relevant fields
documents = []
for entry in data:
    if entry["type"] == "event":
        combined_text = (
            f"{entry['Title']} {entry['Description']} {entry['Main content']} "
            f"{entry['Date']} {entry['Time']} {entry['Location']} {entry['Contact info']}"
        )
    elif entry["type"] == "news":
        combined_text = (
            f"{entry['Title']} {entry['Description']} {entry['Main content']} "
            f"{entry['Date published']} {entry['Author']}"
        )
    documents.append(combined_text)

# Precompute embeddings for documents
doc_embeddings = model.encode(documents)

# Perform semantic search
query = "winter events in the park"
query_embedding = model.encode([query])

# Calculate cosine similarity
similarities = cosine_similarity(query_embedding, doc_embeddings).flatten()

print(f"Query: {query}")

# Print all similarity scores
for i, score in enumerate(similarities):
    print(f"Document {i} similarity score: {score}")

# Get indices of the top 3 most relevant documents
top_3_indices = np.argsort(similarities)[-3:][::-1]

print("\nTop 3 most relevant documents:")
for idx in top_3_indices:
    print(f"Document {idx}: {data[idx]['type'].capitalize()} - {data[idx]['Title']} (Score: {similarities[idx]})")
