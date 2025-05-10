// api/postService.js
const API_URL = 'http://localhost:5001/api';

/**
 * Lấy auth token từ localStorage
 * @returns {Object} Headers với token auth nếu có
 */
const getAuthHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

/**
 * Lấy tất cả bài posts
 * @returns {Promise<Array>} Danh sách posts
 */
export const fetchAllPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Xóa một bài post
 * @param {string} postId - ID của bài post cần xóa
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deletePost = async (postId) => {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to delete post: ${errorData.message || response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Tạo bài post mới
 * @param {Object} postData - Dữ liệu bài post
 * @returns {Promise<Object>} Bài post đã tạo
 */
export const createPost = async (postData) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to create post: ${errorData.message || response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Thích/bỏ thích bài post
 * @param {string} postId - ID của bài post
 * @returns {Promise<Object>} Kết quả
 */
export const toggleLikePost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to toggle like: ${errorData.message || response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};