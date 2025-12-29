// app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the GoogleGenAI client
// It will automatically look for the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the system instruction to constrain the bot's responses
// 💡 REMOVE or COMMENT OUT THE STRICT CAR-ONLY INSTRUCTION
// const SYSTEM_INSTRUCTION =
//   "You are the Ngbuka Car Bot, an expert AI assistant for a car enthusiast forum. Your sole purpose is to answer questions strictly and only about **automotive topics**, including cars, trucks, motorcycles, racing, maintenance, and the auto industry. If a question is **not** about cars or automotive topics, you must politely decline to answer by saying: 'I am only programmed to answer questions about cars and automotive topics. Please ask me a car-related question!'";

// 💡 OPTIONAL: You can set a general, helpful persona if you still want one.
const GENERAL_ASSISTANT_INSTRUCTION =
  "You are a helpful and knowledgeable AI assistant. Answer all user questions thoroughly and accurately, regardless of the topic. Your response must be summarized and should not exceed 700 words.";

/**
 * Handles POST requests for the chat.
 * @param request The incoming request containing the user's message.
 */
export async function POST(request: Request) {
  try {
    // 1. Get the message from the request body
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // 2. Call the Gemini API. The system instruction is now general or removed.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use a fast, powerful model
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        // 💡 Use the new, general instruction OR remove this line completely
        // to use the model's default helpful persona.
        systemInstruction: GENERAL_ASSISTANT_INSTRUCTION,

        // Optional: you can adjust temperature for creativity vs. factualness
        temperature: 0.5,
      },
    });

    // 3. Extract the response text
    const responseText = response.text;

    // 4. Return the response to the frontend
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during chat processing" },
      { status: 500 }
    );
  }
}
