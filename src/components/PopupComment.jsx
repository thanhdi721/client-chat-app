import React, { useState, useEffect } from 'react';
import { X, ThumbsUp, ChevronDown, Smile, Image, Sticker, Send } from 'lucide-react';
import { useAuthStore } from "../store/useAuthStore";
import { fetchPostComments, createComment, fetchCommentReplies, likeComment, unlikeComment } from '../store/commentApi';

const PopupComment = ({ isOpen, onClose, post }) => {
  const [inputValue, setInputValue] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [repliesLoading, setRepliesLoading] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const { authUser, token } = useAuthStore();

  const loadComments = async () => {
    if (!post?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchPostComments(post.id, token);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [post?.id]);

  const handleSubmitComment = async () => {
    if (!inputValue.trim() || !post?.id) return;

    setIsSubmitting(true);
    try {
      await createComment(post.id, inputValue, token);
      // Clear input and refresh comments
      setInputValue('');
      await loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchReplies = async (commentId) => {
    if (expandedReplies[commentId]) {
      setExpandedReplies(prev => ({ ...prev, [commentId]: false }));
      return;
    }

    setRepliesLoading(prev => ({ ...prev, [commentId]: true }));
    try {
      const data = await fetchCommentReplies(commentId, token);
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment,
                parentComment: data.parentComment,
                replies: data.replies 
              }
            : comment
        )
      );
      setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setRepliesLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await unlikeComment(commentId, token);
      } else {
        await likeComment(commentId, token);
      }
      
      // Update the comments state to reflect the new like status
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !isLiked
            };
          }
          return comment;
        })
      );
      
      // Update likedComments state
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isLiked
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Bài viết của {post?.author?.fullName}</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments section */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Chưa có bình luận nào
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment?.id} className={`mb-4 ${comment?.parentComment ? "" : ""}`}>
                <div className="flex items-start gap-2">
                  {comment?.parentComment && (
                    <div className="absolute ml-5 mt-5 h-6 w-6 border-l-2 border-t-2 border-gray-700 rounded-tl-lg"></div>
                  )}
                  <img 
                    src={comment?.author?.profilePic} 
                    alt={`${comment?.author?.fullName}'s avatar`} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-700 rounded-2xl px-3 py-2">
                      <p className="font-medium">{comment?.author?.fullName}</p>
                      <p className="text-sm">{comment?.content}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span>{comment?.timestamp}</span>
                      <button 
                        className={`ml-4 hover:underline ${comment?.isLiked ? 'text-blue-400' : ''}`}
                        onClick={() => handleLikeComment(comment.id, comment?.isLiked)}
                      >
                        {comment?.isLiked ? 'Đã thích' : 'Thích'}
                      </button>
                      <button className="ml-4 hover:underline">Phản hồi</button>
                      {comment?.likes > 0 && (
                        <span className="ml-auto">
                          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full">
                            <ThumbsUp size={12} />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {comment?.replyCount > 0 && (
                  <div className="ml-12 mt-1">
                    <button 
                      className="text-xs text-blue-400 flex items-center"
                      onClick={() => handleFetchReplies(comment.id)}
                      disabled={repliesLoading[comment.id]}
                    >
                      {repliesLoading[comment.id] ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                      ) : (
                        <ChevronDown size={14} className={`mr-1 transition-transform ${expandedReplies[comment.id] ? 'rotate-180' : ''}`} />
                      )}
                      <span>
                        {expandedReplies[comment.id] ? 'Ẩn' : 'Xem tất cả'} {comment?.replyCount} phản hồi
                      </span>
                    </button>
                  </div>
                )}

                {expandedReplies[comment.id] && comment.replies && (
                  <div className="mt-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-12 mb-4">
                        <div className="flex items-start gap-2">
                          <div className="absolute ml-5 mt-5 h-6 w-6 border-l-2 border-t-2 border-gray-700 rounded-tl-lg"></div>
                          <img 
                            src={reply.author.profilePic} 
                            alt={`${reply.author.fullName}'s avatar`} 
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-gray-700 rounded-2xl px-3 py-2">
                              <p className="font-medium">{reply.author.fullName}</p>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <span>{reply.timestamp}</span>
                              <button 
                                className={`ml-4 hover:underline ${reply?.isLiked ? 'text-blue-400' : ''}`}
                                onClick={() => handleLikeComment(reply.id, reply?.isLiked)}
                              >
                                {reply?.isLiked ? 'Đã thích' : 'Thích'}
                              </button>
                              <button className="ml-4 hover:underline">Phản hồi</button>
                              {reply.likes > 0 && (
                                <span className="ml-auto">
                                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full">
                                    <ThumbsUp size={12} />
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comment input */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <img src={authUser?.profilePic} alt="User avatar" className="w-8 h-8 rounded-full" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={`Trả lời ${authUser?.fullName}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isSubmitting) {
                    handleSubmitComment();
                  }
                }}
                className="w-full bg-gray-700 rounded-full py-2 pl-4 pr-20 text-sm focus:outline-none"
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-200">
                  <Smile size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-200">
                  <Image size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-200">
                  <Sticker size={18} />
                </button>
              </div>
            </div>
            {inputValue && (
              <button 
                className="text-blue-400 disabled:text-blue-600"
                onClick={handleSubmitComment}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupComment;