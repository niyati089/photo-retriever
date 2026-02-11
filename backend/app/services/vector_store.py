from typing import List, Dict, Any, Optional
from app.core.database import db
from app.core.logging import get_logger

logger = get_logger(__name__)

class VectorStoreService:
    @staticmethod
    def get_index():
        if not db.pinecone_index:
            logger.error("Pinecone index not initialized")
            raise RuntimeError("Pinecone index not initialized")
        return db.pinecone_index

    @classmethod
    def upsert_vectors(cls, vectors: List[tuple]) -> int:
        """
        Upsert vectors to Pinecone.
        
        Args:
            vectors: List of tuples (id, vector, metadata)
            
        Returns:
            Count of upserted vectors
        """
        try:
            index = cls.get_index()
            # Pinecone expects (id, values, metadata)
            # Ensure vectors are in correct format
            response = index.upsert(vectors=vectors)
            return response.get('upserted_count', 0)
        except Exception as e:
            logger.error(f"Error upserting vectors: {e}")
            raise e

    @classmethod
    def query_vectors(
        cls, 
        vector: List[float], 
        top_k: int = 10, 
        filter: Optional[Dict[str, Any]] = None,
        include_metadata: bool = True
    ) -> Dict[str, Any]:
        """
        Query vectors from Pinecone.
        
        Args:
            vector: Query vector
            top_k: Number of results to return
            filter: Metadata filter
            include_metadata: Whether to include metadata in results
            
        Returns:
            Query response
        """
        try:
            index = cls.get_index()
            response = index.query(
                vector=vector,
                top_k=top_k,
                filter=filter,
                include_metadata=include_metadata
            )
            return response
        except Exception as e:
            logger.error(f"Error querying vectors: {e}")
            raise e

    @classmethod
    def delete_vectors(cls, ids: List[str]):
        """
        Delete vectors from Pinecone.
        
        Args:
            ids: List of vector IDs to delete
        """
        try:
            index = cls.get_index()
            index.delete(ids=ids)
        except Exception as e:
            logger.error(f"Error deleting vectors: {e}")
            raise e

vector_store = VectorStoreService()
