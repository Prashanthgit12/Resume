from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# CORS to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}


@app.post("/ai-enhance")
async def ai_enhance(request: Request):
    data = await request.json()
    section = data.get("section")
    content = data.get("content")

    improved_content = (
        f"{content}\n\n[AI Enhanced]: This content is rewritten for better clarity and impact."
    )

    return {"improved_content": improved_content}


@app.post("/save-resume")
async def save_resume(request: Request):
    data = await request.json()

    # Save the JSON to a file
    with open("resume.json", "w") as f:
        json.dump(data, f, indent=2)

    return {"message": "Resume saved successfully!"}
