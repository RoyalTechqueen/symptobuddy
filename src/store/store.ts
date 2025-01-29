// store.ts
import { create } from 'zustand';

// Define the structure of a Test object
export interface Test {
  id: string;
  name: string;
  date: string;
  time: string;
  symptoms: string[];
}

// Define the state for your store
interface StoreState {
  user: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
  };
  tests: Test[];  // Use the Test interface for the tests array
  setUser: (firstName: string, lastName: string, dateOfBirth: string, gender: string) => void;
  setTests: (test: Test) => void;  // Accept a single test object to be added to the tests array
}

// Create the Zustand store with the appropriate state and actions
const useStore = create<StoreState>((set) => ({
  user: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
  },
  tests: [],  // Initialize as an empty array of Test objects
  setUser: (firstName, lastName, dateOfBirth, gender) =>
    set({ user: { firstName, lastName, dateOfBirth, gender } }),
  setTests: (test) => set((state) => ({ tests: [...state.tests, test] })),
}));

export default useStore;
