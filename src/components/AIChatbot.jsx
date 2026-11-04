import { useState, useEffect, useRef, useContext } from "react";
import useShopContext from "../ShopContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const MAX_HISTORY = 6; // fariimaha ugu dambeeya ee loo diro backend-ka

const AIChatbot = () => {
  const { addToCart } = useShopContext();
  const { user } = useContext(AuthContext);

  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [addedIds, setAddedIds] = useState({});
  const [cooldown, setCooldown] = useState(0); // ✅ countdown marka 429 yimaado

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const storageKey = user ? `ai_chat_${user._id || user.id}` : null;

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    if (!user) return;
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, [user]);

  // ✅ Load messages from localStorage
  useEffect(() => {
    if (!user || !storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setMessages(JSON.parse(saved)); }
      catch { setMessages([]); }
    } else {
      setMessages([]);
    }
  }, [user]);

  // ✅ Save messages
  useEffect(() => {
    if (!user || !storageKey || messages.length === 0) return;
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, user]);

  // ✅ Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ✅ WELCOME MESSAGE
  useEffect(() => {
    if (!user || !isOpen || messages.length !== 0) return;
    const userName = user?.name?.split(" ")[0] || "there";

    if (isAdmin) {
      setMessages([{
        role: "assistant",
        text: `👋 Hey ${userName}! I'm your Malabaani Admin AI Assistant!\n\n📊 What would you like to know about your business?`,
        options: [
          { label: "📊 Overall stats", value: "Show me the overall dashboard statistics" },
          { label: "💰 Total revenue", value: "What is the total revenue?" },
          { label: "👥 Total users", value: "How many users do we have?" },
          { label: "📦 Recent orders", value: "Tell me about recent orders" },
          { label: "🍽️ Total products", value: "How many products do we have?" },
          { label: "⭐ Reviews", value: "How many reviews are there?" },
        ]
      }]);
    } else {
      setMessages([{
        role: "assistant",
        text: `👋 Hey ${userName}! I'm Malabaani Food AI!\n\n🍽️ What are you in the mood for today?`,
        options: [
          { label: "😋 I'm very hungry!", value: "I'm very hungry, recommend something filling and delicious" },
          { label: "🥗 Something light", value: "I want something light and healthy" },
          { label: "🍰 Something sweet", value: "I'm craving something sweet for dessert" },
          { label: "🥤 Just drinks", value: "I just want something cold to drink" },
        ]
      }]);
    }
  }, [isOpen, user]);

  // ✅ SCROLL BOTTOM
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ DRAG
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setHasDragged(true);
      setPosition({
        x: Math.min(Math.max(e.clientX - dragOffset.x, 30), window.innerWidth - 30),
        y: Math.min(Math.max(e.clientY - dragOffset.y, 30), window.innerHeight - 30)
      });
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      setHasDragged(true);
      const touch = e.touches[0];
      setPosition({
        x: Math.min(Math.max(touch.clientX - dragOffset.x, 30), window.innerWidth - 30),
        y: Math.min(Math.max(touch.clientY - dragOffset.y, 30), window.innerHeight - 30)
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, dragOffset]);

  // ✅ return null HOOKS KA DAB
  if (!user) return null;

  // ✅ PARSE JSON
  const parseAIResponse = (rawText) => {
    if (!rawText) return { message: "Something went wrong.", options: null, recommendations: null };
    let cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { message: cleaned, options: null, recommendations: null };
    try { return JSON.parse(jsonMatch[0]); }
    catch { return { message: cleaned, options: null, recommendations: null }; }
  };

  // ✅ Product raadi: index (#), _id, ama magac
  const findProduct = (rec) => {
    const key = String(rec?.id ?? "").replace("#", "").trim();
    if (/^\d+$/.test(key)) {
      const byIndex = products[Number(key) - 1];
      if (byIndex) return byIndex;
    }
    return (
      products.find(p => p._id?.toString() === key) ||
      products.find(p => p.name?.toLowerCase() === rec?.name?.toLowerCase())
    );
  };

  // ✅ SEND MESSAGE
  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading || cooldown > 0) return;

    setInput("");
    setLoading(true);

    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);

    // ✅ Menu kooban: index gaaban halkii _id dheer (tokens badan ayuu badbaadiyaa)
    const menuContext = products.length > 0
      ? products.map((p, i) => `${i + 1}|${p.name}|$${p.price}|${p.category}`).join("\n")
      : "No products available";

    const userName = user?.name || "Customer";
    const token = localStorage.getItem("token");

    let systemPrompt;

    if (isAdmin) {
      systemPrompt = `You are "Malabaani Admin AI", a smart business assistant for MALABAANI restaurant admin panel.

You have access to LIVE real-time dashboard data provided to you.

Your job:
- Answer questions about business stats accurately using ONLY the provided data
- Give useful insights and analysis
- Suggest improvements based on the numbers

LANGUAGE: Respond in ENGLISH ONLY. Do not use any other language.

CRITICAL: Respond ONLY with valid JSON:
{
  "message": "Your English response here",
  "options": ["follow-up question 1", "follow-up question 2"] or null,
  "recommendations": null
}`;
    } else {
      systemPrompt = `You are "Malabaani Food AI", a friendly food assistant for MALABAANI restaurant.
You are helping: ${userName}

Menu (format: number|name|price|category). Use the NUMBER as the id:
${menuContext}

Your job:
1. Have a short friendly conversation to understand what the user wants
2. Ask 1-2 follow-up questions if needed
3. Recommend 2-3 perfect menu items

LANGUAGE: Respond in ENGLISH ONLY. Do not use any other language.

CRITICAL: Respond ONLY with valid JSON:
{
  "message": "Your English response here",
  "options": ["option 1", "option 2"] or null,
  "recommendations": [
    {
      "id": "MENU_NUMBER",
      "name": "product name",
      "price": price_number,
      "emoji": "food emoji",
      "calories": "estimated calories",
      "reason": "short reason why this is perfect"
    }
  ] or null
}

RULES:
- English ONLY
- Keep messages short and friendly
- Only recommend from the menu above
- Maximum 3 recommendations
- Never share business stats or admin data with users`;
    }

    try {
      // ✅ Ka saar fariimaha error + kaliya kuwa ugu dambeeya
      const conversationHistory = newMessages
        .filter(m => !m.isError)
        .slice(-MAX_HISTORY)
        .map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.text
        }));

      const res = await API.post("/ai/chat", {
        system: systemPrompt,
        messages: conversationHistory,
        isAdmin: isAdmin,
        adminToken: isAdmin ? token : null
      });

      const data = res.data;
      const rawText = data.content?.map(b => b.text || "").join("") || "";
      const parsed = parseAIResponse(rawText);

      // ✅ Recommendations - match with database products
      let recommendations = null;
      if (!isAdmin && parsed.recommendations && Array.isArray(parsed.recommendations)) {
        recommendations = parsed.recommendations.map(rec => {
          const dbProduct = findProduct(rec);
          if (dbProduct) {
            return {
              ...rec,
              id: dbProduct._id,
              name: dbProduct.name,
              price: dbProduct.price,
              image: dbProduct.urlImage || dbProduct.image || ""
            };
          }
          return rec;
        });
      }

      const newAssistantMsg = {
        role: "assistant",
        text: parsed.message || "Something went wrong. Please try again!",
        options: parsed.options?.map(o => ({ label: o, value: o })) || null,
        recommendations
      };

      setMessages(prev => {
        const updated = [...prev, newAssistantMsg];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });

    } catch (err) {
      console.error("AI error:", err);

      let errorText = "⚠️ Something went wrong. Please try again!";

      if (err.response?.status === 429) {
        const retryAfter =
          Number(err.response.data?.retryAfter) ||
          Number(err.response.headers?.["retry-after"]) ||
          20;
        setCooldown(retryAfter);
        errorText = `⏳ The AI is busy right now. Please try again in ${retryAfter} seconds.`;
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        text: errorText,
        isError: true
      }]);
    }
    setLoading(false);
  };

  // ✅ ADD TO CART
  const handleAddToCart = (rec) => {
    const dbProduct = findProduct(rec);

    addToCart(dbProduct || {
      _id: rec.id, id: rec.id,
      name: rec.name, price: rec.price,
      urlImage: rec.image || "", category: "food"
    });

    setAddedIds(prev => ({ ...prev, [rec.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [rec.id]: false })), 2000);
  };

  // ✅ Clear chat
  const handleClearChat = () => {
    localStorage.removeItem(storageKey);
    setMessages([]);
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 100);
  };

  const handleButtonClick = () => { if (!hasDragged) setIsOpen(!isOpen); };
  const handleMouseDown = (e) => {
    setIsDragging(true); setHasDragged(false);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleTouchStart = (e) => {
    const touch = e.touches[0]; setIsDragging(true); setHasDragged(false);
    setDragOffset({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const headerBg = isAdmin
    ? "linear-gradient(135deg, #7c3aed, #4c1d95)"
    : "linear-gradient(135deg, #1a73e8, #0d47a1)";

  const buttonBg = isOpen
    ? "linear-gradient(135deg, #e74c3c, #c0392b)"
    : isAdmin
      ? "linear-gradient(135deg, #7c3aed, #4c1d95)"
      : "linear-gradient(135deg, #1a73e8, #0d47a1)";

  const accentColor = isAdmin ? "#7c3aed" : "#1a73e8";

  const blocked = loading || cooldown > 0;

  return (
    <>
      {/* FLOATING BUTTON */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleButtonClick}
        style={{
          position: "fixed", left: position.x, top: position.y,
          transform: "translate(-50%, -50%)", zIndex: 999999,
          width: "58px", height: "58px", borderRadius: "50%",
          background: buttonBg, color: "white", fontSize: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: isDragging ? "grabbing" : "grab",
          boxShadow: `0 4px 20px ${isAdmin ? "rgba(124,58,237,0.5)" : "rgba(26,115,232,0.5)"}`,
          transition: isDragging ? "none" : "background 0.3s",
          userSelect: "none",
        }}
      >
        {isOpen ? "✕" : isAdmin ? "📊" : "🤖"}
        {!isOpen && (
          <div style={{
            position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
            border: `2px solid ${isAdmin ? "rgba(124,58,237,0.4)" : "rgba(26,115,232,0.4)"}`,
            animation: "aiPulse 2s ease-in-out infinite",
          }} />
        )}
      </div>

      {/* CHAT MODAL */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "80px", right: "20px",
          width: "360px", maxWidth: "calc(100vw - 40px)", height: "520px",
          background: "white", borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
          zIndex: 999998, overflow: "hidden", animation: "aiSlideUp 0.3s ease",
        }}>

          {/* HEADER */}
          <div style={{
            background: headerBg, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: "12px", flexShrink: 0,
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>{isAdmin ? "📊" : "🤖"}</div>
            <div>
              <p style={{ margin: 0, color: "white", fontWeight: "bold", fontSize: "15px" }}>
                {isAdmin ? "Malabaani Admin AI" : "Malabaani Food AI"}
              </p>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>
                {isAdmin ? "🟣 Admin Mode" : "🟢 Online"} • {user?.name || "Guest"}
              </p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
              <button onClick={handleClearChat} title="New chat"
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "30px", height: "30px", color: "white", cursor: "pointer", fontSize: "14px" }}>🗑️</button>
              <button onClick={() => setIsOpen(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%", width: "30px", height: "30px", color: "white", cursor: "pointer", fontSize: "14px" }}>✕</button>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: "12px",
            background: isAdmin ? "#f5f3ff" : "#f8f9ff"
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{
                      background: accentColor, color: "white", padding: "10px 14px",
                      borderRadius: "18px 18px 4px 18px",
                      fontSize: "13px", maxWidth: "75%", lineHeight: "1.5"
                    }}>{msg.text}</div>
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: accentColor, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "14px", flexShrink: 0
                    }}>{isAdmin ? "📊" : "🤖"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        background: "white", padding: "10px 14px",
                        borderRadius: "4px 18px 18px 18px", fontSize: "13px",
                        color: "#333", lineHeight: "1.6",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", whiteSpace: "pre-line"
                      }}>{msg.text}</div>

                      {msg.options && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                          {msg.options.map((opt, j) => (
                            <button key={j} onClick={() => sendMessage(opt.value)}
                              disabled={blocked}
                              style={{
                                padding: "6px 12px", background: "white",
                                border: `1.5px solid ${accentColor}`, borderRadius: "20px",
                                fontSize: "12px", color: accentColor,
                                cursor: blocked ? "not-allowed" : "pointer",
                                opacity: blocked ? 0.5 : 1, fontWeight: "500"
                              }}
                              onMouseEnter={e => { if (!blocked) { e.target.style.background = accentColor; e.target.style.color = "white"; } }}
                              onMouseLeave={e => { e.target.style.background = "white"; e.target.style.color = accentColor; }}
                            >{opt.label}</button>
                          ))}
                        </div>
                      )}

                      {/* RECOMMENDATIONS — user only */}
                      {!isAdmin && msg.recommendations && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                          {msg.recommendations.map((rec, j) => (
                            <div key={j} style={{
                              background: "white", borderRadius: "14px", padding: "12px",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                {rec.image ? (
                                  <img src={rec.image} alt={rec.name}
                                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />
                                ) : (
                                  <span style={{ fontSize: "28px" }}>{rec.emoji}</span>
                                )}
                                <div style={{ flex: 1 }}>
                                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px", color: "#222" }}>{rec.name}</p>
                                  <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
                                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#1a73e8" }}>${Number(rec.price)?.toFixed(2)}</span>
                                    <span style={{ fontSize: "11px", color: "#888", background: "#f5f5f5", padding: "1px 6px", borderRadius: "10px" }}>🔥 {rec.calories}</span>
                                  </div>
                                </div>
                              </div>
                              <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#666", lineHeight: "1.4", fontStyle: "italic" }}>"{rec.reason}"</p>
                              <button onClick={() => handleAddToCart(rec)} style={{
                                width: "100%", padding: "8px",
                                background: addedIds[rec.id] ? "#22c55e" : "#1a73e8",
                                color: "white", border: "none", borderRadius: "10px",
                                fontSize: "12px", fontWeight: "bold", cursor: "pointer", transition: "background 0.3s"
                              }}>
                                {addedIds[rec.id] ? "✅ Added to Cart!" : "🛒 Add to Cart"}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%", background: accentColor,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px"
                }}>{isAdmin ? "📊" : "🤖"}</div>
                <div style={{
                  background: "white", padding: "12px 16px", borderRadius: "4px 18px 18px 18px",
                  display: "flex", gap: "4px", alignItems: "center"
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "7px", height: "7px", borderRadius: "50%", background: accentColor,
                      animation: `aiBounce 1.2s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div style={{
            padding: "12px", background: "white", borderTop: "1px solid #f0f0f0",
            display: "flex", gap: "8px", alignItems: "center", flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={
                cooldown > 0
                  ? `⏳ Wait ${cooldown}s...`
                  : isAdmin ? "Ask about your business stats..." : "Type a message..."
              }
              disabled={blocked}
              style={{
                flex: 1, padding: "10px 14px", border: "1.5px solid #e0e0e0",
                borderRadius: "20px", fontSize: "13px", outline: "none",
                background: isAdmin ? "#f5f3ff" : "#f8f9ff", color: "#333", margin: 0
              }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || blocked}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: input.trim() && !blocked ? accentColor : "#e0e0e0",
                color: "white", border: "none", fontSize: "16px",
                cursor: input.trim() && !blocked ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s"
              }}>➤</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes aiSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aiBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;