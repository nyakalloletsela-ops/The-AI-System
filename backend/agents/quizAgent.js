import { generate } from '../services/ollamaClient.js';

const systemPrompt = `
You are a quiz generator. Create a multiple-choice question based on the topic.
Your response MUST be a JSON object with:
{
  "answer": "question statement",
  "latex": "",
  "diagram": "",
  "quiz": {
    "question": "the question text",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0
  },
  "hints": "explain why the answer is correct"
}
The options array must contain exactly four strings. correctIndex is the zero-based index of the correct option.
Example: {"answer": "What is the capital of France?", "latex": "", "diagram": "", "quiz": {"question": "What is the capital of France?", "options": ["London", "Paris", "Berlin", "Madrid"], "correctIndex": 1}, "hints": "Paris is the capital of France."}
`;

export async function generateQuizResponse(userMessage) {
  const prompt = `Generate a quiz about: ${userMessage}\nJSON only.`;
  try {
    const raw = await generate(prompt, 'llama3.2', systemPrompt);
    const parsed = JSON.parse(raw);
    return sanitizeResponse(parsed, raw);
  } catch (error) {
    console.error('Quiz agent parse error:', error);
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
    answer: 'Could not generate quiz',
    latex: '',
    diagram: '',
    quiz: null,
    hints: ''
  };
}