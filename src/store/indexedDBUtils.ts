import { openDB } from 'idb';

// Define the structure for UserProfile and Test
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

interface Test {
  id: string;
  name: string;
  date: string;
  time: string;
  symptoms: string[];
}

// Open the IndexedDB database
const dbPromise = openDB('my-pwa-db', 1, {
  upgrade(db) {
    db.createObjectStore('userProfile', { keyPath: 'id' });
    db.createObjectStore('testHistory', { keyPath: 'id' });
  },
});

// Save User Profile to IndexedDB
export const saveUserProfile = async (profile: UserProfile) => {
  const db = await dbPromise;
  await db.put('userProfile', profile); // Store the profile
};

// Get User Profile from IndexedDB
export const getUserProfile = async (): Promise<UserProfile | undefined> => {
  const db = await dbPromise;
  return db.get('userProfile', 'profile'); // Retrieve the profile with 'profile' as key
};

// Save Test History to IndexedDB
export const saveTestHistory = async (test: Test) => {
  const db = await dbPromise;
  await db.put('testHistory', test); // Store the test
};

// Get Test History from IndexedDB using getAll() for better efficiency
export const getTestHistory = async (): Promise<Test[]> => {
  const db = await dbPromise;
  return (await db.getAll('testHistory')) || []; // Return an empty array if no tests found
};
