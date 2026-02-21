import os
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class RAGEngine:
    """
    Retrieval-Augmented Generation engine backed by FAISS + SentenceTransformer.
    Loads documents from data.txt, builds a FAISS index, and enriches OpenAI
    completions with the top-k retrieved context chunks.
    """

    def __init__(self, data_path: str = "data.txt", model_name: str = "all-MiniLM-L6-v2"):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = SentenceTransformer(model_name)

        # Load and index documents
        if not os.path.exists(data_path):
            raise RuntimeError(f"Data file '{data_path}' not found in backend folder")

        with open(data_path, "r", encoding="utf-8") as f:
            raw_lines = [line.strip() for line in f.readlines()]

        # Filter out blank lines
        self.documents = [line for line in raw_lines if line]

        # Build FAISS index
        print(f"[RAG] Encoding {len(self.documents)} document chunks...")
        embeddings = self.model.encode(self.documents)
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings, dtype=np.float32))
        print("[RAG] FAISS index built successfully ✅")

    def retrieve(self, question: str, k: int = 3) -> list[str]:
        """Return the top-k most relevant document chunks for a given question."""
        query_vec = self.model.encode([question])
        distances, indices = self.index.search(np.array(query_vec, dtype=np.float32), k)
        return [self.documents[i] for i in indices[0] if i < len(self.documents)]

    def ask(self, question: str, k: int = 3) -> dict:
        """
        Retrieve context + query OpenAI.
        Returns { answer: str, retrieved_documents: list[str] }
        """
        retrieved = self.retrieve(question, k=k)
        context = "\n".join(f"- {doc}" for doc in retrieved)

        completion = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are KrishiSahay, an expert agricultural assistant helping Indian farmers. "
                        "Answer the farmer's question using the provided knowledge base context. "
                        "Be practical, concise, and farmer-friendly. If the context does not cover the question, "
                        "answer from your general agricultural knowledge."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Knowledge Base Context:\n{context}\n\nFarmer's Question:\n{question}",
                },
            ],
            temperature=0.4,
            max_tokens=600,
        )

        return {
            "answer": completion.choices[0].message.content,
            "retrieved_documents": retrieved,
        }


# Singleton instance — loaded once at application startup
_rag_engine: RAGEngine | None = None


def get_rag_engine() -> RAGEngine:
    global _rag_engine
    if _rag_engine is None:
        _rag_engine = RAGEngine()
    return _rag_engine
