import { GoogleGenAI } from "@google/genai";
import { PulseData, GroundingSource } from '../types';

// Ensure API Key is present
if (!process.env.API_KEY) {
  console.error("Missing API_KEY in environment variables");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSocialPulse = async (topic: string): Promise<PulseData> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We utilize Google Search grounding to get real social sentiment
    const prompt = `
      Act as a social media data analyst. Your task is to analyze the "Social Pulse" of the following topic: "${topic}".
      
      Use the Google Search tool to find recent discussions, news articles, forum posts (like Reddit), and social commentary.
      
      Based on the search results, construct a JSON analysis with the following strict structure. Do not use Markdown formatting in the response, just return the raw JSON object.

      Structure:
      {
        "topic": "${topic}",
        "summary": "A brief 2-sentence overview of why this topic is trending or relevant right now.",
        "sideA": {
          "name": "Name of the first major perspective (e.g., 'Pro-Reform', 'Optimists')",
          "percentage": number (estimated % of population holding this view, e.g. 45),
          "emotion": "Dominant emotion (e.g., 'Hopeful', 'Angry', 'Skeptical')",
          "arguments": ["Key argument 1", "Key argument 2", "Key argument 3"]
        },
        "sideB": {
          "name": "Name of the opposing perspective",
          "percentage": number (estimated %),
          "emotion": "Dominant emotion",
          "arguments": ["Key argument 1", "Key argument 2", "Key argument 3"]
        },
        "neutral": {
          "percentage": number (remaining %, ensuring sideA + sideB + neutral = 100),
          "summary": "Description of the middle ground or undecided view."
        }
      }

      Ensure the percentages sum to exactly 100. Base the arguments and emotions on the actual search results found.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseSchema is not supported with googleSearch in the current SDK version for this specific flow sometimes,
        // so we rely on the prompt to enforce JSON structure and parse it manually.
      },
    });

    const text = response.text;
    
    // Extract grounding metadata (sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter((web): web is { title: string; uri: string } => !!web && !!web.uri)
      .slice(0, 5); // Take top 5 sources

    // Parse JSON from text (handling potential markdown code blocks)
    let cleanJson = text;
    if (text.includes('```json')) {
      cleanJson = text.replace(/```json\n|\n```/g, '');
    } else if (text.includes('```')) {
      cleanJson = text.replace(/```\n|\n```/g, '');
    }

    try {
      const parsedData = JSON.parse(cleanJson);
      return {
        ...parsedData,
        sources
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      throw new Error("Failed to parse social analysis data.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Unable to connect to the social pulse network.");
  }
};
