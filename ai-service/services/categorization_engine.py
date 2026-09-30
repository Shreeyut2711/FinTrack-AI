import re
from typing import Dict, Any

CATEGORY_RULES = [
    (r"swiggy|zomato|canteen|food|snack|lunch|dinner|restaurant|cafe|dominos|pizza|starbucks|kfc|mcdonald", "Food & Dining"),
    (r"uber|ola|rapido|cab|metro|bus|petrol|fuel|auto|railway|irctc|flight", "Transportation"),
    (r"amazon|flipkart|zara|myntra|h&m|mall|clothes|shoes|shopping|store", "Shopping"),
    (r"movie|cinema|netflix|spotify|prime|hotstar|game|party|concert|ticket|bookmyshow", "Entertainment"),
    (r"book|pen|stationery|notebook|paper|class|course|udemy|coursera|tuition|fee|school|college", "Education & Learning"),
    (r"hospital|pharmacy|doctor|medicine|medical|lab|clinic|health", "Healthcare & Medical"),
    (r"rent|landlord|flat|pg|house|maintenance|electricity|water|wifi|broadband|gas", "Housing & Utilities"),
    (r"salary|freelance|stipend|pocket money|interest|dividend|cashback|refund", "Income & Earnings"),
    (r"sip|stock|mutual fund|zerodha|groww|crypto|investment|fixed deposit", "Investments")
]

class CategorizationEngine:
    @staticmethod
    def suggest_category(description: str, merchant: str = "") -> Dict[str, Any]:
        combined = f"{description} {merchant}".lower()
        
        for pattern, category in CATEGORY_RULES:
            if re.search(pattern, combined):
                return {
                    "category": category,
                    "confidence": 0.95,
                    "method": "rules_match"
                }
                
        return {
            "category": "Miscellaneous",
            "confidence": 0.50,
            "method": "default_fallback"
        }
