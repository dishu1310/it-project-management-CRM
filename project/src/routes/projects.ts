import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../api/projects';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const projects = await getProjects(req.userId);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const projectId = await createProject(req.userId, req.body);
    res.json({ id: projectId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await updateProject(req.userId, req.params.id, req.body);
    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteProject(req.userId, req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;