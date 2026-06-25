import { create } from "zustand";
import { UserRegistration, CategoryId } from "../types";

interface StoreState {
  user: UserRegistration | null;
  categories: CategoryId[];
  notes: string;
  setUser: (userData: UserRegistration | null) => void;
  setCategories: (categoryArray: CategoryId[]) => void;
  setNotes: (noteText: string) => void;
  resetStore: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: JSON.parse(localStorage.getItem("superapp_user") || "null"),
  categories: JSON.parse(localStorage.getItem("superapp_categories") || "[]"),
  notes: localStorage.getItem("superapp_notes") || "",

  setUser: (userData) => {
    if (userData) {
      localStorage.setItem("superapp_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("superapp_user");
    }
    set({ user: userData });
  },
  setCategories: (categoryArray) => {
    localStorage.setItem("superapp_categories", JSON.stringify(categoryArray));
    set({ categories: categoryArray });
  },
  setNotes: (noteText) => {
    localStorage.setItem("superapp_notes", noteText);
    set({ notes: noteText });
  },
  resetStore: () => {
    localStorage.removeItem("superapp_user");
    localStorage.removeItem("superapp_categories");
    localStorage.removeItem("superapp_notes");
    set({
      user: null,
      categories: [],
      notes: "",
    });
  },
}));
