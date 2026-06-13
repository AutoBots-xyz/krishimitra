const { Groq } = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function test() {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: 'user', content: 'Say hello!' }],
    });
    console.log("SUCCESS:", completion.choices[0].message.content);
  } catch (error) {
    console.error("ERROR:", error.message || error);
  }
}

test();
