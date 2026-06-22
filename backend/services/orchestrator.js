import { generateTutorResponse } from '../agents/tutorAgent.js';
import { generateMathResponse } from '../agents/mathAgent.js';
import { generateDiagramResponse } from '../agents/diagramAgent.js';
import { generateQuizResponse } from '../agents/quizAgent.js';

const mathKeywords = /\b(calculate|solve|equation|derivative|integral|algebra|geometry|theorem|physics)\b/i;
const diagramKeywords = /\b(diagram|flowchart|sequence|graph|mermaid|visualize|draw)\b/i;
const quizKeywords = /\b(quiz|question|test|multiple.choice|exam)\b/i;

function classifyIntent(message) {
  if (mathKeywords.test(message)) return 'math';
  if (diagramKeywords.test(message)) return 'diagram';
  if (quizKeywords.test(message)) return 'quiz';
  return 'tutor';
}

export async function handleAIRequest(message) {
  const intent = classifyIntent(message);

  let result;
  switch (intent) {
    case 'math':
      result = await generateMathResponse(message);
      break;
    case 'diagram':
      result = await generateDiagramResponse(message);
      break;
    case 'quiz':
      result = await generateQuizResponse(message);
      break;
    default:
      result = await generateTutorResponse(message);
  }

  // Ensure every required field exists
  return {
    answer: result.answer || '',
    latex: result.latex || '',
    diagram: result.diagram || '',
    quiz: result.quiz || null,
    hints: result.hints || ''
  };
}