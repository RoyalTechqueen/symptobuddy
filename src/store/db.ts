import { openDB } from "idb";

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
  userId: string; // Associate tests with a specific user
  name: string;
  date: string;
  time: string;
  symptoms: string[];
  prediction: string;
}

// Open the IndexedDB database
const dbPromise = openDB("my-pwa-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("userProfile")) {
      db.createObjectStore("userProfile", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("testHistory")) {
      db.createObjectStore("testHistory", { keyPath: "id" });
    }
  },
});

// Save User Profile to IndexedDB
export const saveUserProfile = async (profile: Omit<UserProfile, "id">) => {
  try {
    const db = await dbPromise;
    await db.put("userProfile", { id: "user", ...profile }); // Store as a single entry
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
};

// Get User Profile from IndexedDB
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const db = await dbPromise;
    return (await db.get("userProfile", "user")) || null;
  } catch (error) {
    console.error("Failed to retrieve user profile:", error);
    return null;
  }
};

// Save Test History to IndexedDB
export const saveTestHistory = async (test: Omit<Test, "id" | "userId">, userId: string) => {
  try {
    const db = await dbPromise;
    const newTest = { id: Date.now().toString(), userId, ...test };
    await db.put("testHistory", newTest);
  } catch (error) {
    console.error("Failed to save test history:", error);
  }
};

// Get Test History for a Specific User
export const getTestHistory = async (userId: string): Promise<Test[]> => {
  try {
    const db = await dbPromise;
    const allTests = await db.getAll("testHistory");
    return allTests.filter((test) => test.userId === userId);
  } catch (error) {
    console.error("Failed to retrieve test history:", error);
    return [];
  }
};
