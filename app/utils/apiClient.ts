// Frontend API client for communicating with backend
// This ensures the API key is never exposed to the browser

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiClient = {
  async identifyObject(imageBase64: string, theme?: any) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, theme }),
    });
    if (!response.ok) throw new Error('Failed to identify object');
    return response.json();
  },

  async generateSpeech(text: string) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to generate speech');
    const data = await response.json();
    return data.audio;
  },

  async generateStory(learnedWords: any, theme: any, kidProfile: any, userPrompt?: string) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnedWords, theme, kidProfile, userPrompt }),
    });
    if (!response.ok) throw new Error('Failed to generate story');
    return response.json();
  },

  async generateIllustration(prompt: string, style: string, characterVisual: string) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/illustration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style, characterVisual }),
    });
    if (!response.ok) throw new Error('Failed to generate illustration');
    const data = await response.json();
    return data.imageUrl;
  },

  async lookupWord(word: string, context: string, ageGroup: string) {
    const response = await fetch(`${API_BASE_URL}/api/gemini/lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, context, ageGroup }),
    });
    if (!response.ok) throw new Error('Failed to lookup word');
    return response.json();
  },
};
