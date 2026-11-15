import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/review", async (req, res) => {
  
    console.log("Review API called");

    try {
        const { code, language } = req.body;

        console.log("Code received:", code ? "Yes" : "No");
        console.log("Language:", language);


    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a senior software engineer reviewing a pull request.
Language: ${language}
Code: ${code}

Provide:
1. Quality rating
2. Detailed suggestions
3. Step-by-step explanation
4. Bugs
5. Syntax/runtime issues
6. Fixes
`,
    });
    res.json({ result: response.text });
  }  catch (error) {
        console.error("REVIEW ERROR:", error);

        res.status(500).json({
            message: "Error reviewing code",
            error: error.message });
  }
});

app.post("/fix", async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
}

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are a senior software engineer.

Fix and improve this ${language} code.
Return the code in a very simple beginner-friendly format.
Do not include documentation comments.
Do not use advanced syntax.
Avoid arrow functions and reduce().
Use basic function syntax and loops.
Return only code.
${code}
`,
    });
    res.json({ result: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
