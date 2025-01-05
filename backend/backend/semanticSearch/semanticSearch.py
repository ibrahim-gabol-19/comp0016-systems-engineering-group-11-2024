from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load SentenceTransformer model
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

# Example documents
documents = [
    "Small animals like bunnies are cute.",
    "Cars and vehicles are speeding on the highway.",
    "Birds are small creatures that fly.",
    "9am december 25th paris",
    "11am november central park",
    "12pm 25th december new york",
]

# Precompute embeddings for documents
doc_embeddings = model.encode(documents)

# Perform semantic search
query = "winter in france"
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
    print(f"Document {idx}: {documents[idx]} (Score: {similarities[idx]})")
