import  { create } from "zustand";

// Define the Test type
export type Test = {
  id: string; // Unique identifier for each test
  name: string; // Name of the test
  date: string; // Date when the test was created or scheduled
};

// Define the AppState type for Zustand
export type AppState = {
  tests: Test[]; // Array of tests
  addTest: (newTest: Test) => void; // Function to add a new test
  clearTests: () => void; // Function to clear all tests (optional utility)
};

// Create the Zustand store
const useStore = create<AppState>((set) => ({
  tests: [], // Initialize the tests array
  addTest: (newTest) =>
    set((state) => ({
      tests: [...state.tests, newTest], // Add new test to the tests array
    })),
  clearTests: () =>
    set(() => ({
      tests: [], // Clear all tests
    })),
}));

export default useStore;
