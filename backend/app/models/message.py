from pydantic import BaseModel
from typing import Optional, Dict

class Message(BaseModel):
    user_id: str
    text: str
    user_info: Optional[Dict] = None
