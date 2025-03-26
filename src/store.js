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

    // Other global states
    // theme: getStoredState("theme", "light"),
    // setTheme: (theme) => {
    //     localStorage.setItem("theme", JSON.stringify(theme));
    //     set({ theme });
    // },

    // sidebarOpen: getStoredState("sidebarOpen", true),
    // setSidebarOpen: (isOpen) => {
    //     localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
    //     set({ sidebarOpen: isOpen });
    // },
}));
