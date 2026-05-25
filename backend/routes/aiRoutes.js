const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Product = require("../models/Product");

// ✅ Models list — rate limit hadduu gaaro, kan xiga isku day
const MODELS = [
  "llama-3.1-8b-instant",      // aad u dhaqso, limit weyn
  "gemma2-9b-it",               // Google model, limit gooni
  "llama3-8b-8192",             // backup
];

const callGroq = async (messages, model) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1000,
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });
  return response;
};

router.post("/chat", async (req, res) => {
  try {
    const { messages, system, isAdmin, adminToken } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array required" });
    }

    let adminStats = null;

    // ✅ Admin xogta fetch
    if (isAdmin && adminToken) {
      try {
        const token = adminToken.startsWith("Bearer ")
          ? adminToken.slice(7)
          : adminToken;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Admin token decoded:", decoded);

        if (decoded) {
          const totalUsers = await User.countDocuments({ role: "user" });
          const totalOrders = await Order.countDocuments();
          const totalReviews = await Review.countDocuments();
          const totalProducts = await Product.countDocuments();

          const orders = await Order.find();
          const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

          const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

          const recentUsers = await User.find({ role: "user" })
            .select("name email createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

          const allOrders = await Order.find();
          const productSales = {};
          allOrders.forEach(order => {
            order.items?.forEach(item => {
              const name = item.name || item.product?.name || "Unknown";
              productSales[name] = (productSales[name] || 0) + (item.quantity || 1);
            });
          });
          const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }));

          adminStats = {
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue.toFixed(2),
            totalReviews,
            totalProducts,
            recentOrders: recentOrders.map(o => ({
              user: o.user?.name || "Unknown",
              total: o.total,
              status: o.status,
              date: new Date(o.createdAt).toLocaleDateString()
            })),
            topProducts,
            recentUsers: recentUsers.map(u => ({
              name: u.name,
              email: u.email,
              joined: new Date(u.createdAt).toLocaleDateString()
            }))
          };

          console.log("✅ Admin stats fetched:", adminStats);
        }
      } catch (err) {
        console.error("❌ Token/Stats error:", err.message);
      }
    }

    // ✅ System prompt
    let finalSystem = system || "You are a helpful assistant.";

    if (adminStats) {
      finalSystem = `You are "Malabaani Admin AI". Answer using ONLY this REAL data. Never invent numbers.

=== REAL DATABASE STATS ===
👥 Total Users: ${adminStats.totalUsers}
📦 Total Orders: ${adminStats.totalOrders}
💰 Total Revenue: $${adminStats.totalRevenue}
⭐ Total Reviews: ${adminStats.totalReviews}
🍽️ Total Products: ${adminStats.totalProducts}

🔥 Top Products:
${adminStats.topProducts.length > 0
  ? adminStats.topProducts.map((p, i) => `${i + 1}. ${p.name} — ${p.count} orders`).join("\n")
  : "No sales data yet"}

📋 Recent Orders:
${adminStats.recentOrders.map(o => `- ${o.user} | $${o.total} | ${o.status} | ${o.date}`).join("\n")}

👥 Recent Users:
${adminStats.recentUsers.map(u => `- ${u.name} (${u.email})`).join("\n")}
===========================

RULES:
- Use ONLY numbers above — NEVER make up data
- Respond in BOTH Somali AND English
- Be concise

Respond ONLY with valid JSON:
{
  "message": "Somali\nEnglish",
  "options": ["q1", "q2"] or null,
  "recommendations": null
}`;
    }

    const groqMessages = [
      {
        role: "system",
        content: finalSystem + "\n\nOutput ONLY valid JSON. No markdown. No extra text."
      },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    // ✅ Models fallback — hadduu mid rate limit gaaro, kan xiga isku day
    let text = "";
    let success = false;

    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await callGroq(groqMessages, model);

        if (response.status === 429) {
          console.log(`❌ ${model} rate limited, trying next...`);
          continue;
        }

        if (!response.ok) {
          const errData = await response.json();
          console.error(`❌ ${model} error:`, errData);
          continue;
        }

        const data = await response.json();
        text = data.choices?.[0]?.message?.content || "";
        text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        success = true;
        console.log(`✅ Success with model: ${model}`);
        break;

      } catch (err) {
        console.error(`❌ ${model} failed:`, err.message);
        continue;
      }
    }

    if (!success) {
      return res.status(429).json({
        error: "All models rate limited. Please wait a few minutes and try again.",
        content: [{
          text: JSON.stringify({
            message: "Waqti yar sug oo isku day — AI-gu hadda mashquul buu yahay.\nAll AI models are busy right now. Please wait a few minutes and try again.",
            options: null,
            recommendations: null
          })
        }]
      });
    }

    try {
      JSON.parse(text);
    } catch {
      text = JSON.stringify({ message: text, options: null, recommendations: null });
    }

    res.json({ content: [{ text }] });

  } catch (err) {
    console.error("Route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;