import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateSummary = async (content: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI Configuration Missing: Please set API_KEY in environment.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following blog post content into a concise, engaging paragraph of about 3 sentences. Content: ${content.substring(0, 5000)}`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate summary due to network or API error.";
  }
};

export const generateTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
  const ai = getAIClient();
  if (!ai) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following content, generate a catchy, short title and 3 relevant tags. Return strictly valid JSON.
      Content: ${content.substring(0, 2000)}
      Schema: { "title": "string", "tags": ["string", "string", "string"] }`,
       config: {
        responseMimeType: "application/json",
       }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return { title: "Untitled Post", tags: ["General"] };
  }
};
