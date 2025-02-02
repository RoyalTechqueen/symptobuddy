import { create } from 'zustand';
import { saveUserProfile, getUserProfile, saveTestHistory, getTestHistory } from './indexedDBUtils';

// Define the structure of a Test object
export interface Test {
  id: string;
  name: string;
  date: string;
  time: string;
  symptoms: string[];
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
  user: UserProfile; // Use the UserProfile interface for the user
  tests: Test[]; // Use the Test interface for the tests array
  setUser: (firstName: string, lastName: string, dateOfBirth: string, gender: string) => void;
  setTests: (test: Test) => void; // Accept a single test object to be added to the tests array
  loadUserProfile: () => void; // Function to load the user profile from IndexedDB
  loadTests: () => void; // Function to load tests from IndexedDB
}

// Create the Zustand store
const useStore = create<StoreState>((set) => ({
  user: {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
  },
  tests: [],

  // Load user profile from IndexedDB
  loadUserProfile: async () => {
    const userData = await getUserProfile();
    if (userData) {
      set({ user: userData });
    }
  },

  // Load test history from IndexedDB
  loadTests: async () => {
    const allTests = await getTestHistory();
    set({ tests: allTests });
  },

  // Save user profile to IndexedDB
  setUser: (firstName, lastName, dateOfBirth, gender) => {
    set({ user: { id: 'profile', firstName, lastName, dateOfBirth, gender } });
    saveUserProfile({ id: 'profile', firstName, lastName, dateOfBirth, gender }); // Store in IndexedDB
  },

  // Save a new test to IndexedDB
  setTests: (test) => {
    set((state) => ({ tests: [...state.tests, test] }));
    saveTestHistory(test); // Store in IndexedDB
  },
}));

export default useStore;
