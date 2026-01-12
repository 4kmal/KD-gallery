import { GoogleGenAI, Type } from "@google/genai";
import { LoadingAnimation } from "../types";

// Fixed: Initializing directly with process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAnimation = async (prompt: string): Promise<LoadingAnimation> => {
  // Fixed: Use ai.models.generateContent with model name directly in parameters
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a unique, creative Tailwind CSS loading animation based on this theme: "${prompt}". 
    Return a JSON object with: 
    - name: Catchy name
    - description: Short description
    - html: The HTML code (using standard Tailwind classes)
    - tailwindClasses: The raw tailwind classes used, for reference.
    Make sure the animation is visually striking and uses only Tailwind's built-in or simple arbitrary animations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          html: { type: Type.STRING },
          tailwindClasses: { type: Type.STRING },
        },
        required: ["name", "description", "html", "tailwindClasses"],
      },
    },
  });

  // Fixed: Accessing .text as a property (not a method) as per guidelines
  const data = JSON.parse(response.text);
  return {
    id: `ai-${Date.now()}`,
    name: data.name,
    description: data.description,
    category: 'AI Generated',
    html: data.html,
    tailwindClasses: data.tailwindClasses,
  };
};