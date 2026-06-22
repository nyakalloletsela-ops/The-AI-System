import { generate } from '../services/ollamaClient.js';

const systemPrompt = `
You are a helpful, patient tutor. Provide a clear, step-by-step explanation of the user's question.
Your response MUST be a valid JSON object with exactly these fields:
{
  "answer": "string containing the main explanation (use Markdown for formatting)",
  "latex": "string containing any LaTeX expression (empty string if none)",
  "diagram": "string containing Mermaid diagram code (empty string if none)",
  "quiz": null,
  "hints": "string with additional hints"
}
Example: {"answer": "The derivative of x^2 is 2x.", "latex": "\\frac{d}{dx}x^2 = 2x", "diagram": "", "quiz": null, "hints": "Use the power rule."}
Do NOT include any text outside the JSON object.
`;

export async function generateTutorResponse(userMessage) {
  const prompt = `User asks: ${userMessage}\nRespond ONLY with the JSON object.`;
  try {
    const raw = await generate(prompt, 'llama3.2', systemPrompt);
    const parsed = JSON.parse(raw);
    return sanitizeResponse(parsed, raw);
  } catch (error) {
    console.error('Tutor agent parse error:', error);
    return fallbackResponse(raw);
  }
}

function sanitizeResponse(parsed, raw) {
  return {
    answer: parsed.answer || raw || '',
    latex: parsed.latex || '',
    diagram: parsed.diagram || '',
    quiz: parsed.quiz || null,
    hints: parsed.hints || ''
  };
}

function fallbackResponse(raw) {
  return {
    answer: raw || 'I could not generate a proper response.',
    latex: '',
    diagram: '',
    quiz: null,
    hints: ''
  };
}