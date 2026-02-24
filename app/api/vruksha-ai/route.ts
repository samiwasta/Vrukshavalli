import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-2.5-flash";
const MAX_RETRIES = 2;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type as "image/png" | "image/jpeg";

    const prompt = `You are an expert botanist and plant pathologist. Analyse the uploaded plant image thoroughly.

Respond ONLY with valid JSON (no markdown, no code fences) using this exact structure:

{
  "plantName": "Common name of the plant (or 'Unknown' if not identifiable)",
  "scientificName": "Scientific/botanical name (or 'N/A')",
  "status": "healthy" | "diseased",
  "confidence": 85,
  "diseaseName": "Name of the disease detected (or null if healthy)",
  "summary": "A 2-3 sentence overview of the plant's health condition",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "causes": ["cause 1", "cause 2"],
  "precautions": ["precaution 1", "precaution 2", "precaution 3"],
  "treatment": ["treatment step 1", "treatment step 2", "treatment step 3"],
  "fertilization": ["fertilizer recommendation 1", "fertilizer recommendation 2"],
  "care": ["care tip 1", "care tip 2", "care tip 3"],
  "severity": "mild" | "moderate" | "severe" | "none"
}

Rules:
- confidence should be a number between 0 and 100
- If the plant looks healthy, set status to "healthy", diseaseName to null, severity to "none", and still provide general care/fertilization tips
- If diseased, provide all fields with detailed information
- All array fields must have at least 2 items
- Keep each array item concise (1-2 sentences max)
- If the image is not a plant, respond with: {"error": "The uploaded image does not appear to be a plant. Please upload a clear photo of a plant."}`;

    const contents = [
      {
        role: "user" as const,
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64 } },
        ],
      },
    ];

    /* Retry with back-off on 429 */
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Vruksha AI: attempt ${attempt + 1} with ${MODEL}…`);
        const response = await ai.models.generateContent({
          model: MODEL,
          contents,
        });

        const text = response.text ?? "";

        let cleaned = text.trim();
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }

        const data = JSON.parse(cleaned);

        if (data.error) {
          return NextResponse.json({ error: data.error }, { status: 422 });
        }

        return NextResponse.json({ result: data });
      } catch (err: unknown) {
        const isQuota =
          (err instanceof Error && err.message?.includes("429")) ||
          (err instanceof Error && err.message?.includes("RESOURCE_EXHAUSTED"));

        if (isQuota && attempt < MAX_RETRIES) {
          const waitSec = (attempt + 1) * 30;
          console.warn(`Vruksha AI: rate limited, waiting ${waitSec}s before retry…`);
          await sleep(waitSec * 1000);
          continue;
        }

        if (isQuota) {
          return NextResponse.json(
            {
              error:
                "AI rate limit reached. Free tier allows limited requests per minute. Please wait a minute and try again.",
            },
            { status: 429 }
          );
        }

        throw err;
      }
    }

    return NextResponse.json(
      { error: "Failed to analyse the image. Please try again." },
      { status: 500 }
    );
  } catch (err) {
    console.error("Vruksha AI API error:", err);
    return NextResponse.json(
      { error: "Failed to analyse the image. Please try again." },
      { status: 500 }
    );
  }
}
