import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useGetAllPost = create((set, get) => ({
  data: [],
  isLoading: false,
  error: null,

  getAllPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/posts");
      set({ data: res.data });

      if (typeof get().connectSocket === "function") {
        get().connectSocket();
      }

    } catch (error) {
      console.error("Error in getAllPosts:", error);
      set({ data: [], error: error.message || "Unknown error" });
    } finally {
      set({ isLoading: false });
    }
  },

  resetState: () => {
    set({ data: [], isLoading: false, error: null });
  }
}));
