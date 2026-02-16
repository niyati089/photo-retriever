# backend/app/core/pinecone_client.py

import pinecone

PINECONE_API_KEY = "pcsk_5KZABH_BHMBiZtjhVnLMjPG2PCSHdYyQmPf1KpTdSLa2BzbEdobgTDLphnph41wrYoQzMT"
PINECONE_ENV = "us-west1-gcp-free"
INDEX_NAME = "photo-retriever"

pinecone.init(
    api_key=PINECONE_API_KEY,
    environment=PINECONE_ENV
)

index = pinecone.Index(INDEX_NAME)
