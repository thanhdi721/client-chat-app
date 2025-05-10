import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCreatePost = create((set, get) => ({
  isCreatingPost: false,
  newPost: null,
  error: null,

  createPost: async (postData) => {
    set({ isCreatingPost: true, error: null });
    try {
      const res = await axiosInstance.post("/posts", postData);
      set({ newPost: res.data });
     
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể tạo bài viết";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ isCreatingPost: false });
    }
  },

  resetState: () => {
    set({ isCreatingPost: false, newPost: null, error: null });
  }
}));
