require("dotenv").config();

fetch("https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
})
  .then(r => r.json())
  .then(d => {
    if (d.error) return console.log("Error:", d.error.message);
    d.data.forEach(m => console.log(m.id));
  });