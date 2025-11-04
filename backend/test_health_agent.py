from app.agents.health_agent import health_agent  # import your function

# Memory starts empty
memory = []

# Optional: user info
user_info = {
    "name": "Alice",
    "age": 35,
    "last_screenings": {"mammogram": "2024-06-10", "flu shot": "2024-09-01"}
}

print("=== HealthAgent Chat ===")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    
    # Add user message to memory
    memory.append({"type": "human", "content": user_input})
    
    # Get agent response
    response = health_agent(memory, user_info)
    
    # Add AI response to memory
    memory.append({"type": "ai", "content": response})
    
    print("HealthAgent:", response)
