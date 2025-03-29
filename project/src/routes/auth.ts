import * as express from 'express';
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../api/auth';

const router = express.Router();

router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await registerUser(name, email, password);
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
});

router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Login failed' 
    });
  }
});

export default router;