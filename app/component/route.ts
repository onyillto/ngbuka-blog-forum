import {
  Content,
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GOOGLE_API_KEY || "";

export async function POST(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt, history } = await req.json();

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    // Basic safety settings - adjust as needed
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // The history includes the persona instruction and the previous messages
    const chatHistory: Content[] = [
      {
        role: "user",
        parts: [
          {
            text: `You are Ngbuka AI, an expert car mechanic and AI assistant for the Ngbuka Forum. Your goal is to help users diagnose car problems. Be friendly, concise, and ask clarifying questions to get more details. If a problem sounds dangerous (e.g., brake failure), strongly advise the user to see a professional mechanic immediately.`,
          },
        ],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist users." }],
      },
      // Now, map the actual chat history from the client
      ...(history || []).map((message: { text: string; isBot: boolean }) => ({
        role: message.isBot ? "model" : "user",
        parts: [{ text: message.text }],
      })),
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
