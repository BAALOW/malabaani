const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Product = require("../models/Product");

// ✅ Models la door bidayo (kuwa Groq ka waayo si otomaatig ah ayaa looga saarayaa)
const PREFERRED_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
];

const MAX_HISTORY = 8;
const MAX_TOKENS = 600;
const DEFAULT_WAIT_SEC = 20;
const MAX_WAIT_SHOWN = 60;       // UI ma tusayo wax ka badan 60s
const ERROR_COOLDOWN_MS = 2 * 60 * 1000; // error aan ahayn 429: 2 daqiiqo

const cooldowns = {};
const isCoolingDown = (m) => (cooldowns[m] || 0) > Date.now();
const secondsLeft = (m) =>
  Math.max(1, Math.ceil(((cooldowns[m] || 0) - Date.now()) / 1000));

// ✅ Hubi models-ka dhabta ah ee Groq (cache 10 daqiiqo)
let modelCache = { list: null, time: 0 };

const getModels = async () => {
  if (modelCache.list && Date.now() - modelCache.time < 10 * 60 * 1000) {
    return modelCache.list;
  }
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    });
    if (!r.ok) throw new Error(`models list status ${r.status}`);
    const data = await r.json();
    const available = new Set((data.data || []).map((m) => m.id));
    const list = PREFERRED_MODELS.filter((m) => available.has(m));

    const missing = PREFERRED_MODELS.filter((m) => !available.has(m));
    if (missing.length) console.warn("⚠️ Models aan Groq ku jirin:", missing.join(", "));

    modelCache = { list: list.length ? list : PREFERRED_MODELS, time: Date.now() };
    console.log("✅ Models active:", modelCache.list.join(", "));
  } catch (err) {
    console.error("⚠️ Models list failed:", err.message);
    modelCache = { list: PREFERRED_MODELS, time: Date.now() };
  }
  return modelCache.list;
};

const callGroq = (messages, model, useJsonMode = true) =>
  fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.3,
      ...(useJsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

// ✅ Admin stats cache (60s)
let statsCache = { data: null, time: 0 };
const STATS_TTL = 60 * 1000;

const getAdminStats = async () => {
  if (statsCache.data && Date.now() - statsCache.time < STATS_TTL) {
    return statsCache.data;
  }

  const [totalUsers, totalOrders, totalReviews, totalProducts] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Order.countDocuments(),
    Review.countDocuments(),
    Product.countDocuments(),
  ]);

  const orders = await Order.find().select("total items").lean();
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const productSales = {};
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const name = item.name || item.product?.name || "Unknown";
      productSales[name] = (productSales[name] || 0) + (item.quantity || 1);
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  const recentUsers = await User.find({ role: "user" })
    .select("name email createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  const data = {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue.toFixed(2),
    totalReviews,
    totalProducts,
    recentOrders: recentOrders.map((o) => ({
      user: o.user?.name || "Unknown",
      total: o.total,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString(),
    })),
    topProducts,
    recentUsers: recentUsers.map((u) => ({
      name: u.name,
      email: u.email,
      joined: new Date(u.createdAt).toLocaleDateString(),
    })),
  };

  statsCache = { data, time: Date.now() };
  return data;
};

const busyReply = (retryAfter) => ({
  error: "All AI models are busy.",
  retryAfter,
  content: [
    {
      text: JSON.stringify({
        message: `AI-gu hadda mashquul buu yahay. Fadlan ${retryAfter} ilbiriqsi kadib isku day.\nThe AI is busy right now. Please try again in ${retryAfter} seconds.`,
        options: null,
        recommendations: null,
      }),
    },
  ],
});

router.post("/chat", async (req, res) => {
  try {
    const { messages, system, isAdmin, adminToken } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array required" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY ma jiro .env faylka!");
      return res.status(500).json({ error: "GROQ_API_KEY missing on server" });
    }

    let adminStats = null;

    if (isAdmin && adminToken) {
      try {
        const token = adminToken.startsWith("Bearer ")
          ? adminToken.slice(7)
          : adminToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) adminStats = await getAdminStats();
      } catch (err) {
        console.error("❌ Token/Stats error:", err.message);
      }
    }

    let finalSystem = system || "You are a helpful assistant.";

    if (adminStats) {
      finalSystem = `You are "Malabaani Admin AI". Answer using ONLY this REAL data. Never invent numbers.

=== REAL DATABASE STATS ===
Total Users: ${adminStats.totalUsers}
Total Orders: ${adminStats.totalOrders}
Total Revenue: $${adminStats.totalRevenue}
Total Reviews: ${adminStats.totalReviews}
Total Products: ${adminStats.totalProducts}

Top Products:
${
  adminStats.topProducts.length > 0
    ? adminStats.topProducts.map((p, i) => `${i + 1}. ${p.name} - ${p.count} orders`).join("\n")
    : "No sales data yet"
}

Recent Orders:
${adminStats.recentOrders.map((o) => `- ${o.user} | $${o.total} | ${o.status} | ${o.date}`).join("\n")}

Recent Users:
${adminStats.recentUsers.map((u) => `- ${u.name} (${u.email})`).join("\n")}
===========================

RULES:
- Use ONLY numbers above - NEVER make up data
- Respond in ENGLISH ONLY
- Be concise

Respond ONLY with valid JSON:
{
  "message": "English answer",
  "options": ["q1", "q2"] or null,
  "recommendations": null
}`;
    }

    const trimmed = messages.slice(-MAX_HISTORY);

    const groqMessages = [
      {
        role: "system",
        content: finalSystem + "\n\nOutput ONLY valid JSON. No markdown. No extra text.",
      },
      ...trimmed.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })),
    ];

    const MODELS = await getModels();

    let text = "";
    let success = false;

    for (const model of MODELS) {
      if (isCoolingDown(model)) {
        console.log(`⏭️ ${model} cooling down (${secondsLeft(model)}s)`);
        continue;
      }

      try {
        console.log(`Trying model: ${model}`);
        let response = await callGroq(groqMessages, model, true);

        // Model-ku JSON mode ma taageero? Isku day la'aanteed
        if (response.status === 400) {
          const errData = await response.json().catch(() => ({}));
          console.warn(`⚠️ ${model} 400: ${errData?.error?.message || "unknown"} -> retry without json mode`);
          response = await callGroq(groqMessages, model, false);
        }

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get("retry-after"), 10) || DEFAULT_WAIT_SEC;
          cooldowns[model] = Date.now() + retryAfter * 1000;
          console.log(`❌ ${model} rate limited, wait ${retryAfter}s. Trying next...`);
          continue;
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error(`❌ ${model} error ${response.status}:`, errData?.error?.message || errData);
          cooldowns[model] = Date.now() + ERROR_COOLDOWN_MS;
          continue;
        }

        const data = await response.json();
        text = data.choices?.[0]?.message?.content || "";
        text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

        if (!text) continue;

        success = true;
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (err) {
        console.error(`❌ ${model} failed:`, err.message);
        cooldowns[model] = Date.now() + 30 * 1000;
        continue;
      }
    }

    if (!success) {
      const waits = MODELS.filter(isCoolingDown).map(secondsLeft);
      const retryAfter = Math.min(
        waits.length ? Math.min(...waits) : DEFAULT_WAIT_SEC,
        MAX_WAIT_SHOWN
      );
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json(busyReply(retryAfter));
    }

    try {
      JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      try {
        JSON.parse(m?.[0]);
        text = m[0];
      } catch {
        text = JSON.stringify({ message: text, options: null, recommendations: null });
      }
    }

    res.json({ content: [{ text }] });
  } catch (err) {
    console.error("Route error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;