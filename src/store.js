import { create } from "zustand";

// Load state from localStorage
const getStoredState = (key, defaultValue) => {
    if (typeof window !== "undefined") {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    return defaultValue;
};

export const useAppStore = create((set) => ({
    // User state
    user: getStoredState("user", null),
    setUser: (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData });
    },
    logout: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },

    userMetrics: {},
    setUserMetrics: (userMetrics) => {
        set({ userMetrics: userMetrics });
    },

    weightHistory: [],
    setWeightHistory: (weightHistory) => {
        set({ weightHistory: weightHistory });
    },

    // User preferences
    userPreferences: {},
    setUserPreferences: (userPreferences) => {
        set({ userPreferences: userPreferences });
    },

    // User goals
    userGoals: {},
    setUserGoals: (userGoals) => {
        set({ userGoals: userGoals });
    },

    
}));
