import { ObjectId } from 'mongodb';
import { connectToDb } from '../lib/mongodb';

export async function getProjects(userId: string) {
  const db = await connectToDb();
  const projects = db.collection('projects');

  return projects.find({ userId: new ObjectId(userId) }).toArray();
}

export async function createProject(userId: string, projectData: any) {
  const db = await connectToDb();
  const projects = db.collection('projects');

  const result = await projects.insertOne({
    ...projectData,
    userId: new ObjectId(userId),
    createdAt: new Date(),
  });

  return result.insertedId;
}

export async function updateProject(userId: string, projectId: string, projectData: any) {
  const db = await connectToDb();
  const projects = db.collection('projects');

  await projects.updateOne(
    { _id: new ObjectId(projectId), userId: new ObjectId(userId) },
    { $set: projectData }
  );
}

export async function deleteProject(userId: string, projectId: string) {
  const db = await connectToDb();
  const projects = db.collection('projects');

  await projects.deleteOne({
    _id: new ObjectId(projectId),
    userId: new ObjectId(userId)
  });
}