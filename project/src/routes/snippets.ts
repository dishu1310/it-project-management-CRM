import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet
} from '../api/snippets';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const snippets = await getSnippets(req.userId);
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const snippetId = await createSnippet(req.userId, req.body);
    res.json({ id: snippetId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await updateSnippet(req.userId, req.params.id, req.body);
    res.json({ message: 'Snippet updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteSnippet(req.userId, req.params.id);
    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;