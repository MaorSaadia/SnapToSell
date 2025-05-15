import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Check if this is a product description request
    const isProductDescRequest =
      message.toLowerCase().includes("product description") ||
      message.toLowerCase().includes("generate product") ||
      message.toLowerCase().includes("create product description");

    // Set system instructions based on request type
    let systemPrompt = "";
    let maxOutputTokens = 800;

    if (isProductDescRequest) {
      systemPrompt =
        "You are a concise marketing assistant. When creating product descriptions:" +
        "\n1. Keep descriptions brief (100-150 words max)" +
        "\n2. Focus only on key product features and benefits" +
        "\n3. Use punchy, compelling language" +
        "\n4. Format clearly with name, brief pitch, 2-3 key features, and call to action" +
        "\n5. Skip asking for additional information - work with what's provided" +
        "\n6. Don't provide multiple examples or templates";
      maxOutputTokens = 300;
    }

    // Prepare chat history, ensuring it starts with a user message
    let validHistory = [...(history as ChatMessage[])];

    // If history starts with an assistant message (which is not allowed by Gemini),
    // we need to fix the history
    if (validHistory.length > 0 && validHistory[0].role === "assistant") {
      // If there's more than one message, remove the first one and proceed
      // If there's only one message, just don't use history at all
      if (validHistory.length > 1) {
        validHistory = validHistory.slice(1);
      } else {
        validHistory = [];
      }
    }

    // Convert history to the right format for Chat
    const formattedHistory = validHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Generate content based on history and current message
    let result;

    if (formattedHistory.length > 0) {
      // With history
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxOutputTokens,
        },
      });

      // Send message with system instructions if needed
      if (systemPrompt) {
        result = await chat.sendMessage([
          { text: systemPrompt },
          { text: message },
        ]);
      } else {
        result = await chat.sendMessage(message);
      }
    } else {
      // No history, use generateContent directly
      const contentParts = systemPrompt
        ? [{ text: systemPrompt }, { text: message }]
        : [{ text: message }];

      result = await model.generateContent({
        contents: [{ role: "user", parts: contentParts }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxOutputTokens,
        },
      });
    }

    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process your request", details: String(error) },
      { status: 500 }
    );
  }
}
