import os
from dotenv import load_dotenv
from groq import Groq
import json
from database import SessionLocal
from models import Email

load_dotenv()

def process_emails():
    client = Groq(
        api_key=os.getenv("GROQ_API_KEY")
        )
    db = SessionLocal()

    processed_count = 0

    pending_emails = db.query(Email).filter(Email.status == "pending").all()
    
    
    for row in pending_emails:
        try:
    
            email = row.email
        
            print("\nProcessing email:")
            print(email)
        
            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
        Analyze this email.
    
        Classify it into one of these categories:
        
        customer_support, work, personal, spam, other
        
        Also create a short summary.
        
        Choose one action:
        
        create_customer_support_task
        save_work_task
        save_personal_email
        move_to_spam
        review_manually
        
        Return ONLY valid JSON.
        
        Use exactly this format:
        
        {{
            "category": "work",
            "summary": "short summary here",
            "action": "save_work_task"
        }}
        
        Email:
        {email}
        """
                    }
                ]
            )
        
            result = response.choices[0].message.content
        
            data = json.loads(result)
        
            category = data["category"].strip()
            summary = data["summary"].strip()
            action = data["action"].strip()
        
            print("category:", category)
            print("summary:", summary)
            print("action:", action)
    
            row.category = category
            row.summary = summary
            row.action = action
            row.status = "processed"
            
            db.commit()
            
            
            print("Database updated successfully")
        
            
            if action == "create_customer_support_task":
                print("Action: Create customer support task")
                with open("customer_support.txt", "a")as file:
                    file.write(summary + "\n")
                
            elif action == "save_work_task":
                print("Action: Add email to work task list")
                with open("work_tasks.txt","a")as file:
                    file.write(summary + "\n")
                
            
            elif action == "save_personal_email":
                print("Action: Save as personal email")
                with open("personal_emails.txt","a")as file:
                    file.write(summary + "\n")
            
            elif action == "move_to_spam":
                print("Action: Move email to spam")
                with open("spam_emails.txt","a")as file:
                    file.write(summary + "\n")
            
            else:
                print("Action: Review email manually")
            processed_count += 1
            
        except Exception as e:
            print("Error processing email:", e)
            db.rollback()
            row.retry_count += 1
            if row.retry_count < 3:
                row.status = "pending"
                print("Email will be retried")
            else:
                row.status = "error"
                print("Maximum retries reached")

            db.commit()
    db.close()
    return processed_count     

            