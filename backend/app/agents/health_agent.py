from typing import List, Optional
from openai import OpenAI
from dotenv import load_dotenv
import os
import re

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Hardcoded service costs
service_costs = {
    "mammogram": 150,
    "flu shot": 25,
    "annual exam": 120
}

# Simple in-memory appointments
appointments = []

def health_agent(memory: List[dict], user_info: Optional[dict] = None):
    """
    memory: list of previous messages [{type: "human"/"ai", content: "..."}, ...]
    user_info: optional dict with user-specific info (name, age, last screenings)
    """

    # Build system prompt
    system_prompt = """
You are a friendly healthcare assistant named HealthAgent.
You answer user questions about health services and guide them politely.
Available services: Mammogram, Flu Shot, Annual Exam.
Provide clear instructions and suggest follow-up actions (Schedule, Estimate cost, Ask another question).
    """

    # Personalize system prompt with user info
    if user_info:
        user_details = []
        if user_info.get("name"):
            user_details.append(f"User's name is {user_info['name']}.")
        if user_info.get("age"):
            user_details.append(f"User is {user_info['age']} years old.")
        if user_info.get("last_screenings"):
            user_details.append(f"Last screenings: {user_info['last_screenings']}.")
        if user_details:
            system_prompt += "\nUser Info:\n" + "\n".join(user_details)

    # Build conversation history
    messages = [{"role": "system", "content": system_prompt}]
    for msg in memory:
        role = "user" if msg["type"] == "human" else "assistant"
        messages.append({"role": role, "content": msg["content"]})

    # Get last user message
    last_user_msg = memory[-1]["content"].lower() if memory else ""

    # Detect scheduling intent
    schedule_keywords = ["schedule", "appointment", "book", "set up"]
    schedule_intent = False
    scheduled_service = None
    for service in service_costs.keys():
        if any(keyword in last_user_msg for keyword in schedule_keywords) and service in last_user_msg:
            schedule_intent = True
            scheduled_service = service
            break

    # Check if user provided date/time
    date_match = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", last_user_msg)
    time_match = re.search(r"\b(\d{1,2}:\d{2})\b", last_user_msg)
    date_provided = date_match.group(1) if date_match else None
    time_provided = time_match.group(1) if time_match else None

    gpt_reply = ""

    # Scheduling flow
    if schedule_intent:
        if not date_provided or not time_provided:
            gpt_reply = f"Sure! You want to schedule a {scheduled_service.title()} appointment. " \
                        "Could you please provide a preferred date (YYYY-MM-DD) and time (HH:MM)?"
        else:
            appointments.append({
                "service": scheduled_service,
                "user_name": user_info.get("name") if user_info else "User",
                "date": date_provided,
                "time": time_provided
            })
            gpt_reply = f"Your {scheduled_service.title()} appointment has been scheduled for {date_provided} at {time_provided}. " \
                        "You can see it in your upcoming appointments dashboard. Do you want to schedule anything else?"

    # If no scheduling intent, use GPT
    else:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7
        )
        gpt_reply = response.choices[0].message.content

    # Always append cost if a service is mentioned
    for service, cost in service_costs.items():
        if service in last_user_msg:
            gpt_reply += f"\n\nBy the way, a {service.title()} usually costs around ${cost}. " \
                         "This can vary depending on your location or insurance, so you might want to confirm with your provider."

    return gpt_reply
