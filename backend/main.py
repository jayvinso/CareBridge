from fastapi import FastAPI
from app.routes import chat
from app.routes import oauth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your frontend (React Native or React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your chat routes
app.include_router(chat.router)
app.include_router(oauth.router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}
