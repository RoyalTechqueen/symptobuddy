import { create } from "zustand";
import {
  saveUserProfile,
  getUserProfile,
  saveTestHistory,
  getTestHistory,
  deleteTestHistory, // Function to delete test history
} from "./db";

// Define the structure of a Test object
export interface Test {
  id: string;
  userId: string; // 🔹 Associate tests with a specific user
  name: string;
  date: string;
  time: string;
  symptoms: string[];
  prediction: string;
}

// Define the structure for UserProfile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

// Define the state for your store
interface StoreState {
  user: UserProfile;
  tests: Test[];
  setUser: (firstName: string, lastName: string, dateOfBirth: string, gender: string) => void;
  setTests: (test: Omit<Test, "id" | "userId">) => void; // Omit ID and userId since they are auto-generated
  deleteTest: (id: string) => void; // 🔹 Add the deleteTest method
  loadUserProfile: () => Promise<void>;
  loadTests: () => Promise<void>;
}

// Create the Zustand store
const useStore = create<StoreState>((set, get) => ({
  user: {
    id: "user",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
  },
  tests: [],

  // Load user profile from IndexedDB
  loadUserProfile: async () => {
    try {
      const userData = await getUserProfile();
      if (userData) {
        set({ user: userData });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  },

  // Load only tests for the current user
  loadTests: async () => {
    try {
      const { user } = get();
      if (!user.id) return;
      const userTests = await getTestHistory(user.id); // 🔹 Pass user.id
      set({ tests: userTests });
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  },

  // Save user profile to IndexedDB
  setUser: (firstName, lastName, dateOfBirth, gender) => {
    const userProfile = { id: "user", firstName, lastName, dateOfBirth, gender };
    set({ user: userProfile });
    saveUserProfile(userProfile);
  },

  // Save a new test with the current user.id
  setTests: (test) => {
    const { user } = get();
    if (!user.id) return;
    const newTest = { id: Date.now().toString(), userId: user.id, ...test }; // 🔹 Include userId
    set((state) => ({ tests: [...state.tests, newTest] }));
    saveTestHistory(test, user.id); // 🔹 Pass user.id
  },

  // Delete a test by id
  deleteTest: (id: string) => {
    const { user } = get();
    if (!user.id) return;
    // Remove the test from the local state
    set((state) => ({
      tests: state.tests.filter((test) => test.id !== id),
    }));
    // Delete it from IndexedDB (only pass the test id)
    deleteTestHistory(id); // Only passing the test id now
  },
}));

export default useStore;
