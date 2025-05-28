const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Fetch comments for a specific post
 * @param {string} postId - The ID of the post
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - Array of comments
 */
export const fetchPostComments = async (postId, token) => {
  if (!postId) throw new Error('Post ID is required');
  
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  
  return await response.json();
};

/**
 * Create a new comment on a post
 * @param {string} postId - The ID of the post
 * @param {string} content - Comment content
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Created comment
 */
export const createComment = async (postId, content, token) => {
  if (!postId) throw new Error('Post ID is required');
  if (!content.trim()) throw new Error('Comment content cannot be empty');
  
  const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ content: content.trim() })
  });
  
  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
  
  return await response.json();
};

/**
 * Fetch replies for a specific comment
 * @param {string} commentId - The ID of the comment
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Object containing parent comment and replies
 */
export const fetchCommentReplies = async (commentId, token) => {
  if (!commentId) throw new Error('Comment ID is required');
  
  const response = await fetch(`${API_BASE_URL}/comments/replies/${commentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch replies');
  }
  
  return await response.json();
};

/**
 * Like a comment
 * @param {string} commentId - The ID of the comment
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated comment
 */
export const likeComment = async (commentId, token) => {
  if (!commentId) throw new Error('Comment ID is required');
  
  const response = await fetch(`${API_BASE_URL}/comments/like/${commentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to like comment');
  }
  
  return await response.json();
};

/**
 * Unlike a comment
 * @param {string} commentId - The ID of the comment
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Updated comment
 */
export const unlikeComment = async (commentId, token) => {
  if (!commentId) throw new Error('Comment ID is required');
  
  const response = await fetch(`${API_BASE_URL}/comments/unlike/${commentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to unlike comment');
  }
  
  return await response.json();
};