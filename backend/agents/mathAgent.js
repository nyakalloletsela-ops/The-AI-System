import { generate } from '../services/ollamaClient.js';

const systemPrompt = `
You are an advanced mathematics and physics tutor. Always provide step-by-step reasoning.
Your response MUST be a JSON object with:
{
  "answer": "detailed explanation",
  "latex": "the main LaTeX expression (properly escaped for JSON, e.g. \\\\frac{...})",
  "diagram": "Mermaid code if relevant, else empty string",
  "quiz": null,
  "hints": "short hints"
}
All mathematical notation must be written in LaTeX inside the "latex" field, using proper syntax like \\frac{a}{b}, \\sqrt{x}, etc.
Example: {"answer": "We apply the chain rule.", "latex": "\\\\frac{d}{dx}\\\\sin(x^2) = 2x\\\\cos(x^2)", "diagram": "", "quiz": null, "hints": "Chain rule: derivative of outer times derivative of inner."}
`;

export async function generateMathResponse(userMessage) {
  const prompt = `Solve this math problem: ${userMessage}\nOutput JSON only.`;
  try {
    const raw = await generate(prompt, 'llama3.2', systemPrompt);
    const parsed = JSON.parse(raw);
    return sanitizeResponse(parsed, raw);
  } catch (error) {
    console.error('Math agent parse error:', error);
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
    answer: raw || 'I could not solve this problem.',
    latex: '',
    diagram: '',
    quiz: null,
    hints: ''
  };
}