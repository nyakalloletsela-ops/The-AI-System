import { generate } from '../services/ollamaClient.js';

const systemPrompt = `
You are a diagram expert. Generate Mermaid.js code that visualizes the user's request.
Your response MUST be a JSON object with:
{
  "answer": "brief description of the diagram",
  "latex": "",
  "diagram": "the raw Mermaid code (e.g. graph TD; A-->B;)",
  "quiz": null,
  "hints": ""
}
Do NOT wrap the diagram code in a code block. It must be pure Mermaid syntax.
Example: {"answer": "Simple flowchart", "latex": "", "diagram": "graph TD;\n  A[Start] --> B[End];", "quiz": null, "hints": "This shows start to end."}
`;

export async function generateDiagramResponse(userMessage) {
  const prompt = `Create a Mermaid diagram for: ${userMessage}\nJSON only.`;
  try {
    const raw = await generate(prompt, 'llama3.2', systemPrompt);
    const parsed = JSON.parse(raw);
    return sanitizeResponse(parsed, raw);
  } catch (error) {
    console.error('Diagram agent parse error:', error);
    return fallbackResponse(raw);
  }
}

function sanitizeResponse(parsed, raw) {
  return {
    answer: parsed.answer || 'Diagram generated',
    latex: parsed.latex || '',
    diagram: parsed.diagram || '',
    quiz: parsed.quiz || null,
    hints: parsed.hints || ''
  };
}

function fallbackResponse(raw) {
  return {
    answer: 'Could not generate diagram',
    latex: '',
    diagram: '',
    quiz: null,
    hints: ''
  };
}