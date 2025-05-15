import { NextRequest, NextResponse } from "next/server";
import { geminiProVision } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const productName = formData.get("productName") as string;
    const category = formData.get("category") as string;
    const format = (formData.get("format") as string) || "standard"; // standard, bullet, social

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the image file to a format Gemini can understand
    const imageBytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(imageBytes).toString("base64");

    // Prepare the prompt based on the desired format
    let prompt = `This is a product image for "${productName}" in the category "${category}". `;

    switch (format) {
      case "bullet":
        prompt += `Generate a detailed product description in bullet point format, highlighting key features, benefits, and specifications.`;
        break;
      case "social":
        prompt += `Generate compelling social media copy for this product. Include 3 engaging captions suitable for Instagram, Facebook, and Twitter (280 character limit). Make them attention-grabbing and sales-oriented.`;
        break;
      default: // standard
        prompt += `Generate a detailed and compelling product description in paragraph format (2-3 paragraphs). Highlight key features, benefits, materials, and anything else visually apparent. Be factual but engaging.`;
    }

    // Call the Gemini API
    const result = await geminiProVision.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      description: text,
      format: format,
    });
  } catch (error) {
    console.error("Error generating product description:", error);
    return NextResponse.json(
      { error: "Failed to generate product description" },
      { status: 500 }
    );
  }
}
