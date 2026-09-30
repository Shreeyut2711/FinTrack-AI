import os
from dotenv import load_dotenv

load_dotenv()

PORT = int(os.getenv("AI_SERVICE_PORT", "5000"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OCR_API_KEY = os.getenv("OCR_API_KEY", "")
