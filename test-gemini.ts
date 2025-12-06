import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testGemini() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    console.log("Checking API Key exists:", !!apiKey);
    console.log("Key:", apiKey?.substring(0, 10) + "...");

    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }

    try {
        console.log("Fetching available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("ListModels Error:", data.error.message);

            // If listing fails, try a blind test with gemini-2.0-flash-exp (sometimes new keys get access to new models)
            // or gemini-pro
            return;
        }

        console.log("Available Models:");
        if (data.models) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log("- " + m.name);
                }
            });
        }

    } catch (error: any) {
        console.error("Script Error:", error.message);
    }
}

testGemini();
