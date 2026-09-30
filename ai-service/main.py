from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import config
from services.financial_analyzer import FinancialAnalyzer
from services.categorization_engine import CategorizationEngine
from services.receipt_ocr import ReceiptOCR
from services.llm_provider import LLMProvider

app = FastAPI(
    title="FinTrack AI Engine",
    description="Python FastAPI Financial Intelligence Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    transactions: List[Dict[str, Any]]

class CategoryRequest(BaseModel):
    description: str
    merchant: Optional[str] = ""

class AssistantRequest(BaseModel):
    prompt: str
    financial_context: Dict[str, Any]

class EmergencyTargetRequest(BaseModel):
    essential_expenses: float
    months: int = 6

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinTrack AI Engine",
        "python_version": "3.14.2"
    }

@app.post("/analyze")
def analyze_financials(req: AnalysisRequest):
    return FinancialAnalyzer.analyze_transactions(req.transactions)

@app.post("/categorize")
def categorize_transaction(req: CategoryRequest):
    return CategorizationEngine.suggest_category(req.description, req.merchant)

@app.post("/ocr-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    contents = await file.read()
    return ReceiptOCR.process_receipt_image(contents, file.filename)

@app.post("/assistant")
async def ai_assistant_chat(req: AssistantRequest):
    response_text = await LLMProvider.generate_response(req.prompt, req.financial_context)
    return {
        "reply": response_text,
        "context_used": req.financial_context
    }

@app.post("/emergency-target")
def calculate_emergency_fund(req: EmergencyTargetRequest):
    return FinancialAnalyzer.calculate_emergency_fund_target(req.essential_expenses, req.months)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=True)
