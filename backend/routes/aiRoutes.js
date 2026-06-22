import { Router } from 'express';
import { handleAIRequest } from '../services/orchestrator.js';

const router = Router();

router.post('/ai', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await handleAIRequest(message);
    res.json(response);
  } catch (error) {
    console.error('Orchestrator error:', error);
    res.status(500).json({ error: 'Internal processing error' });
  }
});

export default router;