import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.post("/generate", async (req, res) => {
    try {
        const { name, role, company, skills } = req.body;

        const prompt = `
Generate a professional cover letter using the following details.

Candidate Name: ${name}
Job Role: ${role}
Company: ${company}
Skills: ${skills}

Rules:
- Keep the cover letter between 180 and 220 words.
- Use a formal and professional tone.
- Include exactly 4 short paragraphs.
- Do not use bullet points.
- End with "Sincerely," followed by the candidate's name.
- Return only the cover letter text without any extra explanation or title.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const coverLetter =
            typeof response.text === "function"
                ? response.text()
                : response.text;

        res.json({
            coverLetter
        });

    } catch (error) {
        console.error("Gemini Error:", error);

        res.status(500).json({
            error: "Failed to generate cover letter."
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});