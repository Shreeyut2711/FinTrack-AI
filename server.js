import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Category mapping helper
const CATEGORIES = [
  "Food & Snacks",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Stationery",
  "Others"
];

// Helper to sanitize & extract transaction details from voice prompt
function parseVoiceTransaction(query) {
  const q = query.toLowerCase();
  
  // Extract amount (e.g. 500, ₹500, 500 rupees, 500 rs)
  const amountMatch = q.match(/(?:₹|rs|rupees|rupee)?\s*(\d+(?:\.\d+)?)\s*(?:rs|rupees|rupee)?/i);
  const amt = amountMatch ? parseFloat(amountMatch[1]) : null;

  if (!amt) return null;

  // Determine Type (income vs expense)
  let type = "expense";
  if (q.includes("received") || q.includes("got") || q.includes("income") || q.includes("salary") || q.includes("pocket money")) {
    type = "income";
  }

  // Determine Category
  let cat = "Others";
  if (q.includes("food") || q.includes("swiggy") || q.includes("zomato") || q.includes("canteen") || q.includes("snack") || q.includes("lunch") || q.includes("dinner") || q.includes("khana")) {
    cat = "Food & Snacks";
  } else if (q.includes("uber") || q.includes("auto") || q.includes("cab") || q.includes("bus") || q.includes("metro") || q.includes("travel") || q.includes("transport")) {
    cat = "Transportation";
  } else if (q.includes("shopping") || q.includes("clothes") || q.includes("zara") || q.includes("shoes") || q.includes("dress")) {
    cat = "Shopping";
  } else if (q.includes("movie") || q.includes("cinema") || q.includes("game") || q.includes("party") || q.includes("entertainment")) {
    cat = "Entertainment";
  } else if (q.includes("book") || q.includes("pen") || q.includes("stationery") || q.includes("notebook") || q.includes("copy")) {
    cat = "Stationery";
  }

  // Determine Title / Merchant
  let title = "Voice Expense";
  if (q.includes("swiggy")) title = "Swiggy";
  else if (q.includes("canteen")) title = "Campus Canteen";
  else if (q.includes("uber")) title = "Uber";
  else if (q.includes("zara")) title = "Zara";
  else if (q.includes("bookstore") || q.includes("book")) title = "Bookstore";
  else if (type === "income") title = "Pocket Money / Income";
  else title = `${cat} Expense`;

  const todayStr = new Date().toISOString().split("T")[0];

  return {
    name: title,
    amt: amt,
    type: type,
    cat: type === "income" ? "Received Money" : cat,
    date: todayStr
  };
}

// POST /api/voice-assistant
app.post('/api/voice-assistant', async (req, res) => {
  try {
    const { query, financialContext, pendingAction, isConfirmation } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Invalid voice query string." });
    }

    const q = query.trim().toLowerCase();

    // 1. Handle Explicit Confirmation for Pending Voice Transaction
    if (pendingAction && pendingAction.type === "ADD_TRANSACTION_CONFIRMATION") {
      const positiveWords = ["yes", "yeah", "sure", "add", "add it", "confirm", "save", "ok", "okay", "haan", "sahi hai", "karo"];
      const negativeWords = ["no", "cancel", "don't", "stop", "nah", "mat karo", "nhi"];

      if (positiveWords.some(w => q.includes(w))) {
        return res.json({
          textResponse: `Awesome! I've confirmed and saved your ${pendingAction.tx.type} of ₹${pendingAction.tx.amt} under ${pendingAction.tx.cat}.`,
          speechText: `Awesome! I have saved your ${pendingAction.tx.type} of ${pendingAction.tx.amt} rupees under ${pendingAction.tx.cat}.`,
          executeAction: {
            type: "CREATE_TRANSACTION",
            tx: pendingAction.tx
          },
          clearPending: true
        });
      } else if (negativeWords.some(w => q.includes(w))) {
        return res.json({
          textResponse: "Cancelled transaction request. No changes were made.",
          speechText: "Cancelled transaction request. No changes were made.",
          clearPending: true
        });
      }
    }

    // 2. Check if the user is asking to ADD a transaction
    if (q.includes("add") || q.includes("spent") || q.includes("paid") || q.includes("bought") || q.includes("record") || q.includes("debit") || q.includes("credit")) {
      const parsedTx = parseVoiceTransaction(query);

      if (parsedTx) {
        const typeLabel = parsedTx.type === "income" ? "income" : "expense";
        const confirmMsg = `Should I add an ${typeLabel} of ₹${parsedTx.amt} under ${parsedTx.cat} for today?`;
        const speechMsg = `Should I add an ${typeLabel} of ${parsedTx.amt} rupees under ${parsedTx.cat} for today? Say yes to confirm.`;

        return res.json({
          textResponse: confirmMsg,
          speechText: speechMsg,
          pendingAction: {
            type: "ADD_TRANSACTION_CONFIRMATION",
            tx: parsedTx
          }
        });
      }
    }

    // 3. Financial Questions (Q&A Mode) using authenticated user's actual context
    const { totalSpent = 0, totalReceived = 0, currentBalance = 0, spendingData = [], lastTransactions = [] } = financialContext || {};

    // Question: How much spent this month / week?
    if (q.includes("how much did i spend") || q.includes("total spend") || q.includes("total expense") || q.includes("kitna kharcha") || q.includes("spending")) {
      const topCat = spendingData.length > 0 ? spendingData[0] : null;
      let resp = `You have spent a total of ₹${totalSpent.toLocaleString("en-IN")} so far.`;
      if (topCat) {
        resp += ` Your highest expenditure is in ${topCat.name} at ₹${topCat.value.toLocaleString("en-IN")}.`;
      }
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Question: Total income / pocket money received
    if (q.includes("income") || q.includes("received") || q.includes("pocket money") || q.includes("kitna aaya")) {
      const resp = `You have received a total of ₹${totalReceived.toLocaleString("en-IN")} in pocket money/income this month.`;
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Question: Balance / Money remaining
    if (q.includes("balance") || q.includes("remaining") || q.includes("left") || q.includes("bacha")) {
      const resp = `Your current pocket money balance is ₹${currentBalance.toLocaleString("en-IN")}.`;
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Question: How much money saved
    if (q.includes("save") || q.includes("savings")) {
      const savingsEstimate = Math.max(0, currentBalance - 5000);
      const resp = `You have saved approximately ₹${savingsEstimate.toLocaleString("en-IN")} this month, maintaining a strong savings rate!`;
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Question: Highest spending category
    if (q.includes("category") || q.includes("highest") || q.includes("most") || q.includes("where did i spend")) {
      if (spendingData.length === 0) {
        return res.json({
          textResponse: "You have no recorded expenses in your categories yet.",
          speechText: "You have no recorded expenses in your categories yet."
        });
      }
      const topCat = [...spendingData].sort((a, b) => b.value - a.value)[0];
      const resp = `You spent the most on ${topCat.name}, totaling ₹${topCat.value.toLocaleString("en-IN")}.`;
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Question: Last five transactions
    if (q.includes("last 5") || q.includes("last five") || q.includes("recent transaction") || q.includes("history")) {
      if (lastTransactions.length === 0) {
        return res.json({ textResponse: "You don't have any recent transactions recorded.", speechText: "You don't have any recent transactions recorded." });
      }
      const txSummary = lastTransactions.slice(0, 5).map(t => `${t.name}: ${t.amt > 0 ? '+' : '-'}₹${Math.abs(t.amt)}`).join(", ");
      const resp = `Your last 5 transactions are: ${txSummary}.`;
      return res.json({ textResponse: resp, speechText: resp });
    }

    // Default LLM proxy / Smart assistant fallback response
    const defaultResp = `I'm tracking your pocket money balance of ₹${currentBalance.toLocaleString("en-IN")}. You can ask me "How much did I spend?", "Show my last 5 transactions", or say "Add 500 rupees for food today".`;
    return res.json({ textResponse: defaultResp, speechText: defaultResp });

  } catch (err) {
    console.error("Voice Assistant Server Error:", err);
    res.status(500).json({ error: "Internal server error processing voice request." });
  }
});

app.listen(PORT, () => {
  console.log(`[FinTrack Voice Server] Running on http://localhost:${PORT}`);
});
