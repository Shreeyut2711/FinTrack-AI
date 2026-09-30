import pandas as pd
from typing import List, Dict, Any

class FinancialAnalyzer:
    @staticmethod
    def analyze_transactions(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not transactions:
            return {
                "total_income": 0.0,
                "total_expenses": 0.0,
                "net_savings": 0.0,
                "savings_rate": 0.0,
                "category_breakdown": {},
                "anomalies": [],
                "top_expense_category": None
            }
        
        df = pd.DataFrame(transactions)
        
        # Ensure numeric amount
        df['amount'] = pd.to_numeric(df.get('amount', 0), errors='coerce').fillna(0)
        
        income_df = df[df['type'] == 'income']
        expense_df = df[df['type'] == 'expense']
        
        total_income = float(income_df['amount'].sum())
        total_expenses = float(expense_df['amount'].sum())
        net_savings = total_income - total_expenses
        savings_rate = round((net_savings / total_income * 100), 2) if total_income > 0 else 0.0
        
        # Category breakdown for expenses
        cat_group = expense_df.groupby('category')['amount'].sum().to_dict() if not expense_df.empty else {}
        sorted_cats = sorted(cat_group.items(), key=lambda x: x[1], reverse=True)
        top_category = sorted_cats[0][0] if sorted_cats else None
        
        # Anomaly detection: expenses > 2 * mean expense
        anomalies = []
        if not expense_df.empty and len(expense_df) > 3:
            mean_exp = expense_df['amount'].mean()
            std_exp = expense_df['amount'].std()
            high_exp = expense_df[expense_df['amount'] > (mean_exp + 1.5 * std_exp)]
            for _, row in high_exp.iterrows():
                anomalies.append({
                    "description": row.get('description', 'Expense'),
                    "amount": float(row.get('amount', 0)),
                    "category": row.get('category', 'Uncategorized'),
                    "date": str(row.get('date', ''))
                })

        return {
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate": max(0.0, savings_rate),
            "category_breakdown": {k: round(v, 2) for k, v in cat_group.items()},
            "top_expense_category": top_category,
            "anomalies": anomalies
        }

    @staticmethod
    def calculate_emergency_fund_target(essential_monthly_expenses: float, months: int = 6) -> Dict[str, Any]:
        target = essential_monthly_expenses * months
        return {
            "essential_monthly_expenses": essential_monthly_expenses,
            "selected_months": months,
            "target_amount": round(target, 2)
        }
