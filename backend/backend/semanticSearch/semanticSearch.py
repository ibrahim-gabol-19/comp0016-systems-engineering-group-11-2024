# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# # import os
# # import django

# # # Set Django settings module
# # os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# # # Set up Django
# # django.setup()

# # # Now import your models
# # from articles.models import Article

# # Load SentenceTransformer model
# model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

# # Example data for events and news
# data = [
#     # {
#     #     "type": "event",
#     #     "Title": "Christmas Celebration",
#     #     "Description": "A festive gathering to celebrate Christmas.",
#     #     "Main content": "Join us for music, food, and games.",
#     #     "Date": "25th December",
#     #     "Time": "5 PM",
#     #     "Location": "Central Park",
#     #     "Contact info": "events@holidayfun.com",
#     # },
#     # {
#     #     "type": "event",
#     #     "Title": "Winter Marathon",
#     #     "Description": "A charity run to support local shelters.",
#     #     "Main content": "Participants will run through scenic winter paths.",
#     #     "Date": "15th January",
#     #     "Time": "9 AM",
#     #     "Location": "Hyde Park",
#     #     "Contact info": "contact@wintermarathon.com",
#     # },
#     # {
#     #     "type": "news",
#     #     "Title": "dhgubf",
#     #     "Description": "Paris experiences heaviest snowfall in decades.",
#     #     "Main content": "The city is covered in a thick blanket of snow, disrupting transportation.",
#     #     "Date published": "10th December",
#     #     "Author": "hbfg",
#     # },
#     # {
#     #     "type": "news",
#     #     "Title": "Record Snowfall in Paris",
#     #     "Description": "Paris experiences heaviest snowfall in decades.",
#     #     "Main content": "The city is covered in a thick blanket of snow, disrupting transportation.",
#     #     "Date published": "10th December",
#     #     "Author": "Jane Doe",
#     # },
#     # {
#     #     "type": "news",
#     #     "Title": "New Year Fireworks",
#     #     "Description": "Cities worldwide welcome the New Year with fireworks.",
#     #     "Main content": "Major cities light up the sky with dazzling fireworks displays.",
#     #     "Date published": "1st January",
#     #     "Author": "John Smith",
#     # },
#     {
#         "type": "news",
#         "Title": "dhgubf",
#         "Description": "efbub",
#         "Main content": "hdtbrub",
#         "Date published": "2025-01-21",
#         "Author": "hbfg",
#     },
#     {
#         "type": "news",
#         "Title": "Record Snowfall in Paris",
#         "Description": "Paris experiences heaviest snowfall in decades.",
#         "Main content": "The city is covered in a thick blanket of snow, disrupting transportation.",
#         "Date published": "2025-01-21",
#         "Author": "Jane Doe",
#     },
#     {
#         "type": "news",
#         "Title": "New Year Fireworks",
#         "Description": "Cities worldwide welcome the New Year with fireworks.",
#         "Main content": "Major cities light up the sky with dazzling fireworks displays.",
#         "Date published": "2025-01-21",
#         "Author": "John Smith",
#     },
# ]

# # Preprocess data by combining relevant fields
# documents = []
# for entry in data:
#     if entry["type"] == "event":
#         combined_text = (
#             f"{entry['Title']} {entry['Description']} {entry['Main content']} "
#             f"{entry['Date']} {entry['Time']} {entry['Location']} {entry['Contact info']}"
#         )
#     elif entry["type"] == "news":
#         combined_text = (
#             f"{entry['Title']} {entry['Description']} {entry['Main content']} "
#             f"{entry['Date published']} {entry['Author']}"
#         )
#     documents.append(combined_text)

# # articles = Article.objects.all()
# # article_ids = []  # Store IDs to map back to the database

# # for article in articles:
# #     combined_text = (
# #         f"{article.title} {article.description} {article.content} "
# #         f"{article.published_date} {article.author}"
# #     )
# #     documents.append(combined_text)
# #     article_ids.append(article.id)

# # Precompute embeddings for documents
# doc_embeddings = model.encode(documents)

# # Perform semantic search
# query = "winter events in the park"
# query_embedding = model.encode([query])

# # Calculate cosine similarity
# similarities = cosine_similarity(query_embedding, doc_embeddings).flatten()

# print(f"Query: {query}")

# # Print all similarity scores
# for i, score in enumerate(similarities):
#     print(f"Document {i} similarity score: {score}")

# # Get indices of the top 3 most relevant documents
# top_3_indices = np.argsort(similarities)[-3:][::-1]

# print("\nTop 3 most relevant documents:")
# for idx in top_3_indices:
#     print(f"Document {idx}: {data[idx]['type'].capitalize()} - {data[idx]['Title']} (Score: {similarities[idx]})")
# # for idx in top_3_indices:
# #     article = Article.objects.get(id=article_ids[idx])
# #     print(f"Title: {article.title}, Score: {similarities[idx]}")

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load the semantic search model globally to avoid reloading it for every request
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")


def preprocess_articles(articles):
    """
    Combine relevant fields of articles into a single string for semantic search.
    """
    return [f"{article.title} {article.description} {article.content}" for article in articles]


def compute_embeddings(documents):
    """
    Compute embeddings for a list of documents.
    """
    return model.encode(documents)


def semantic_search(query, doc_embeddings, articles):
    """
    Perform semantic search using cosine similarity.
    Returns the top 3 most relevant articles.
    """
    query_embedding = model.encode([query])
    similarities = cosine_similarity(query_embedding, doc_embeddings).flatten()
    
    # Get indices of the top 3 most relevant documents
    top_3_indices = np.argsort(similarities)[-3:][::-1]
    
    return [
        {
            "title": articles[int(idx)].title,
            "similarity_score": float(similarities[int(idx)])  # Convert to Python float
        }
        for idx in top_3_indices
    ]
