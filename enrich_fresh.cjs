const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIkk8Xt6KT";

async function test() {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      messages: [{ role: "user", content: "Say hi" }]
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data));
}
test();
