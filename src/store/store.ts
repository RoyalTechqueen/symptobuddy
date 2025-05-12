import { create } from "zustand";
import {
  saveUserProfile,
  getUserProfile,
  saveTestHistory,
  getTestHistory,
  deleteTestHistory,
} from "./db";

// Define the structure of a Test object
export interface DiseaseInfo {
  overview: string;
  causes: string;
  symptoms: string;
  next_steps: string;
}

export interface Test {
  id: string;
  userId: string;
  name: string;
  date: string;
  time: string;
  symptoms: string[];
  prediction: string;
  diseaseInfo?: DiseaseInfo;
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
  predictionResult: string;
  diseaseInfo: DiseaseInfo | null;

  setUser: (firstName: string, lastName: string, dateOfBirth: string, gender: string) => void;
  setTests: (test: Omit<Test, "id" | "userId">) => void;
  deleteTest: (id: string) => void;
  loadUserProfile: () => Promise<void>;
  loadTests: () => Promise<void>;
  setPredictionResult: (result: string) => void;
  setDiseaseInfo: (info: DiseaseInfo) => void;
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
  predictionResult: "",
  diseaseInfo: null,

  loadUserProfile: async () => {
    try {
      const userData = await getUserProfile();
      if (userData) {
        set({ user: userData });
        await get().loadTests(); // Ensure tests are loaded after user data is loaded
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  },

  loadTests: async () => {
    try {
      const { user } = get();
      if (!user.id) return; // Ensure user is loaded before fetching tests
      const userTests = await getTestHistory(user.id);
      set({ tests: userTests }); // Load tests for the current user
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  },

  setUser: (firstName, lastName, dateOfBirth, gender) => {
    const userProfile = { id: "user", firstName, lastName, dateOfBirth, gender };
    set({ user: userProfile });
    saveUserProfile(userProfile); // Save user profile
  },

  setTests: (test) => {
    const { user } = get();
    if (!user.id) return;
    const newTest: Test = { id: Date.now().toString(), userId: user.id, ...test };
    set((state) => ({ tests: [...state.tests, newTest] }));
    saveTestHistory(newTest); // Save the test data (including diseaseInfo)
    console.log("Test saved:", newTest); // Debugging log to confirm test is saved
  },

  deleteTest: (id: string) => {
    const { user } = get();
    if (!user.id) return;
    set((state) => ({
      tests: state.tests.filter((test) => test.id !== id),
    }));
    deleteTestHistory(id); // Remove test history
  },

  setPredictionResult: (result) => {
    set({ predictionResult: result });
  },

  setDiseaseInfo: (info) => {
    set({ diseaseInfo: info });
  },
}));

export default useStore;
