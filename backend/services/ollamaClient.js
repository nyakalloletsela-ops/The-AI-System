const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const DEFAULT_MODEL = 'llama3.2';

export async function generate(prompt, model = DEFAULT_MODEL, system = '') {
  const url = `${OLLAMA_BASE_URL}/api/generate`;

  const body = {
    model,
    prompt,
    system,
    stream: false,
    format: 'json',
    options: {
      temperature: 0.7
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.response; // raw string from Ollama
}