from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from fastapi.middleware.cors import CORSMiddleware
import faiss
import numpy as np
from openai import OpenAI
import os
from fastapi import HTTPException
import requests
from fastapi import FastAPI



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI 🚀"}

@app.get("/api/data")
def get_data():
    return {
        "name": "FastAPI Backend",
        "status": "Connected successfully"
    }

@app.get("/weather")
def get_weather(lat: float, lon: float):
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        response = requests.get(url)

        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Weather API failed")

        data = response.json()

        if "current_weather" not in data:
            raise HTTPException(status_code=400, detail="Invalid weather data")

        return {
            "temperature": data["current_weather"]["temperature"],
            "windspeed": data["current_weather"]["windspeed"]
        }

    except Exception as e:
        print("Weather Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

client = OpenAI(api_key="https://api.open-meteo.com/v1/forecast")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
with open("data.txt", "r") as f:
    documents = f.readlines()

model = SentenceTransformer("all-MiniLM-L6-v2")
doc_embeddings = model.encode(documents)

dimension = doc_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(doc_embeddings))

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_question(query: Query):
    query_vector = model.encode([query.question])
    D, I = index.search(np.array(query_vector), k=3)
    answers = [documents[i] for i in I[0]]
    return {"answers": answers}

@app.post("/ai")
def ai_response(query: dict):
    user_question = query["question"]
    
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an intelligent agriculture expert assistant helping farmers with practical advice."},
            {"role": "user", "content": user_question}
        ]
    )
    
    return {"answer": completion.choices[0].message.content}
