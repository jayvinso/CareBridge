from fastapi import APIRouter
from app.models.message import Message
from app.agents.health_agent import health_agent

router = APIRouter()

memory_store = {}  # Keep memory per user session

@router.post("/chat")
def chat_endpoint(msg: Message):
    user_id = msg.user_id
    memory = memory_store.get(user_id, [])

    # If this is the first message, add a greeting first
    if not memory:
        name = msg.user_info.get("name", "there") if msg.user_info else "there"
        greeting = f"Hello {name}! How can I assist you today with your health needs?"
        memory.append({"type": "ai", "content": greeting})

    # Append current user message
    memory.append({"type": "human", "content": msg.text})

    # Call health_agent
    reply = health_agent(memory, user_info=msg.user_info)

    # Append agent reply
    memory.append({"type": "ai", "content": reply})
    memory_store[user_id] = memory

    return {"response": reply, "memory": memory}

