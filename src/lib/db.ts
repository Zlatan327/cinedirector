import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { HistoryEntry } from '../types';

const DB_NAME = 'cinedirector-db';
const DB_VERSION = 1;
const STORE = 'history';

interface CineDB extends DBSchema {
  history: {
    key: string;
    value: HistoryEntry;
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<CineDB>> | null = null;

function getDb(): Promise<IDBPDatabase<CineDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('by-date', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function saveHistory(entry: HistoryEntry): Promise<void> {
  const db = await getDb();
  await db.put(STORE, entry);
}

export async function getAllHistory(): Promise<HistoryEntry[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex(STORE, 'by-date');
  return all.reverse(); // newest first
}

export async function deleteHistory(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
}

export async function clearHistory(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE);
}
