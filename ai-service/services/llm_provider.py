import os
import httpx
from typing import Dict, Any, List

class LLMProvider:
    @staticmethod
    async def generate_response(prompt: str, context: Dict[str, Any]) -> str:
        openai_key = os.getenv("OPENAI_API_KEY", "")
        gemini_key = os.getenv("GEMINI_API_KEY", "")

        # Try OpenAI if configured
        if openai_key:
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {openai_key}"},
                        json={
                            "model": "gpt-4o-mini",
                            "messages": [
                                {"role": "system", "content": "You are FinTrack AI Assistant, an expert personal finance counselor. Always base answers strictly on the provided financial context."},
                                {"role": "user", "content": f"Financial Context: {context}\n\nUser Question: {prompt}"}
                            ],
                            "max_tokens": 400
                        },
                        timeout=10.0
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return data['choices'][0]['message']['content']
            except Exception as err:
                print(f"OpenAI API call error fallback: {err}")

        # Try Gemini if configured
        if gemini_key:
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.post(
                        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}",
                        json={
                            "contents": [{
                                "parts": [{"text": f"You are FinTrack AI Assistant. Based strictly on this financial context: {context}, answer the user: {prompt}"}]
                            }]
                        },
                        timeout=10.0
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return data['candidates'][0]['content']['parts'][0]['text']
            except Exception as err:
                print(f"Gemini API call error fallback: {err}")

        # Robust NLG Fallback based on deterministic data
        q = prompt.lower()
        currency = context.get('currency_symbol', '₹')
        total_income = context.get('total_income', 0.0)
        total_expenses = context.get('total_expenses', 0.0)
        net_savings = total_income - total_expenses
        savings_rate = context.get('savings_rate', 0.0)
        emergency_fund = context.get('emergency_fund_balance', 0.0)
        essential_expenses = context.get('essential_expenses', 0.0)
        coverage_months = round(emergency_fund / essential_expenses, 1) if essential_expenses > 0 else 0.0

        if "spend" in q or "expense" in q or "where did i spend" in q:
            top_cat = context.get('top_expense_category', 'General')
            return f"Your total expenses for this period are {currency}{total_expenses:,.2f}. Your highest expenditure category is '{top_cat}'."

        if "save" in q or "savings" in q:
            return f"You saved {currency}{net_savings:,.2f} this period, which represents a savings rate of {savings_rate:.1f}%."

        if "emergency" in q or "fund" in q or "coverage" in q:
            return f"Your current Emergency Fund has {currency}{emergency_fund:,.2f}, providing {coverage_months} months of essential expense coverage."

        if "afford" in q:
            # Check affordability query
            amounts = [float(s) for s in q.split() if s.replace('.', '', 1).isdigit()]
            check_amt = amounts[0] if amounts else 5000.0
            if net_savings >= check_amt:
                return f"Yes! Based on your net savings of {currency}{net_savings:,.2f} this period, a purchase of {currency}{check_amt:,.2f} fits within your financial capacity."
            else:
                return f"Caution advised. A purchase of {currency}{check_amt:,.2f} exceeds your current surplus savings of {currency}{net_savings:,.2f} for this period."

        return f"Based on your authenticated records: Total Income is {currency}{total_income:,.2f}, Total Expenses are {currency}{total_expenses:,.2f}, Surplus Savings are {currency}{net_savings:,.2f} ({savings_rate}% savings rate)."
