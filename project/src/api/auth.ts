import { connectToDb } from '../lib/mongodb';
import { hashPassword, verifyPassword, generateToken } from '../lib/auth';

export async function registerUser(name: string, email: string, password: string) {
  const db = await connectToDb();
  const users = db.collection('users');

  // Check if user already exists
  const existingUser = await users.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const result = await users.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  // Generate token
  const token = generateToken(result.insertedId.toString());
  return { success: true, token };
}

export async function loginUser(email: string, password: string) {
  const db = await connectToDb();
  const users = db.collection('users');

  // Find user
  const user = await users.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user._id.toString());
  return { success: true, token };
}