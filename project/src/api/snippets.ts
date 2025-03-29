import { ObjectId } from 'mongodb';
import { connectToDb } from '../lib/mongodb';

export async function getSnippets(userId: string) {
  const db = await connectToDb();
  const snippets = db.collection('snippets');

  return snippets.find({ userId: new ObjectId(userId) }).toArray();
}

export async function createSnippet(userId: string, snippetData: any) {
  const db = await connectToDb();
  const snippets = db.collection('snippets');

  const result = await snippets.insertOne({
    ...snippetData,
    userId: new ObjectId(userId),
    createdAt: new Date(),
  });

  return result.insertedId;
}

export async function updateSnippet(userId: string, snippetId: string, snippetData: any) {
  const db = await connectToDb();
  const snippets = db.collection('snippets');

  await snippets.updateOne(
    { _id: new ObjectId(snippetId), userId: new ObjectId(userId) },
    { $set: snippetData }
  );
}

export async function deleteSnippet(userId: string, snippetId: string) {
  const db = await connectToDb();
  const snippets = db.collection('snippets');

  await snippets.deleteOne({
    _id: new ObjectId(snippetId),
    userId: new ObjectId(userId)
  });
}