import { GoogleGenAI, Type } from "@google/genai";

const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined;
const ai = new GoogleGenAI({ apiKey: (apiKey || "MISSING_KEY") as string });

export interface DetectionResult {
  vehicleNumber: string;
  confidence: number;
  boundingBox?: {
    ymin: number;
    xmin: number;
    ymax: number;
    xmax: number;
  };
}

export async function detectLicensePlate(base64Image: string): Promise<DetectionResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this image of a vehicle. 
  1. Detect the license plate (number plate).
  2. Extract the text (registration number).
  3. Clean the text (remove symbols, spaces).
  4. Provide a confidence score (0-100).
  5. Provide normalized bounding box coordinates [ymin, xmin, ymax, xmax] for the plate area (0-1000 scale).

  Return the result in strictly JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vehicleNumber: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          boundingBox: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.NUMBER },
              xmin: { type: Type.NUMBER },
              ymax: { type: Type.NUMBER },
              xmax: { type: Type.NUMBER },
            },
            required: ["ymin", "xmin", "ymax", "xmax"],
          },
        },
        required: ["vehicleNumber", "confidence"],
      },
    },
  });

  const result = JSON.parse(response.text || "{}");
  return result as DetectionResult;
}
