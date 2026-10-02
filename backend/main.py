from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai import process_emails
from database import SessionLocal
from models import Email

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "AI Text Summarizer API is running"}

@app.post("/process-emails")
def process_pending_emails():

    count = process_emails()

    return{
        "message": "emails processed successfully",
        "processed_count": count
    }

@app.get("/emails")
def get_emails():

    db = SessionLocal()
    emails = db.query(Email).all()
    result = []

    for email in emails:

        result.append({
            "id": email.id,
            "email": email.email,
            "category": email.category,
            "summary": email.summary,
            "action": email.action,
            "status": email.status
        })
    db.close()
    return result