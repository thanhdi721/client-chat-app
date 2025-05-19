import React, { useState } from 'react';
import { X, ThumbsUp, MessageCircle, ChevronDown, Smile, Image, Sticker, Send } from 'lucide-react';

const PopupComment = ({ isOpen, onClose, postId }) => {
  const [inputValue, setInputValue] = useState('');
  console.log(postId);

  const comments = [
    {
      id: 1,
      author: 'Kiên Bùi',
      avatar: '/api/placeholder/40/40',
      content: 'Ẻ ae mà sao lúc combat Đông Long Đảo ko thấy ông này nhỉ, lại bị đièu đi đâu ak',
      time: '11 giờ',
      likes: 0,
      replies: 0
    },
    {
      id: 2,
      author: 'Hay Lê',
      avatar: '/api/placeholder/40/40',
      content: 'Kiên Bùi toàn tốn đinh vs bán thánh k đậy ra tank lấy biết danh vua lì đòn à',
      time: '11 giờ',
      likes: 0,
      replies: 0,
      isReply: true
    },
    {
      id: 3,
      author: 'Huy Leo Nguyen',
      avatar: '/api/placeholder/40/40',
      content: 'Kiên Bùi nói chiến Cổ Long tộc ko có chỗ cho con sói tai tỵ xiu rồng xẹn vào',
      time: '4 giờ',
      likes: 0,
      replies: 0
    },
    {
      id: 4,
      author: 'Đồngđồng Nguyễn',
      avatar: '/api/placeholder/40/40',
      content: 'Trận chiến khủy đồng long đảo mà k thấy hùng chiến gậu đâu nhỉ chắc lại dạg lịch luyện nơi nào í',
      time: '11 giờ',
      likes: 0,
      replies: 0
    },
    {
      id: 5,
      author: 'Ngày Buồn',
      avatar: '/api/placeholder/40/40',
      content: 'Tập mấy ae nhỉ',
      time: '11 giờ',
      likes: 0,
      replies: 0
    },
    {
      id: 6,
      author: 'Nguyễn Hoàng Duy',
      avatar: '/api/placeholder/40/40',
      content: 'Nói mới nhớ tập mấy long đảo đánh nhau sao ko thấy ông ta',
      time: '',
      likes: 0,
      replies: 0
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center w-full h-screen bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium">Bài viết của HH Trung Quốc AnimeHay</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comments section */}
        <div className="max-h-96 overflow-y-auto p-2">
          {comments.map((comment) => (
            <div key={comment.id} className={`mb-4 ${comment.isReply ? "ml-12" : ""}`}>
              <div className="flex items-start gap-2">
                {comment.isReply && (
                  <div className="absolute ml-5 mt-5 h-6 w-6 border-l-2 border-t-2 border-gray-700 rounded-tl-lg"></div>
                )}
                <img 
                  src={comment.avatar} 
                  alt={`${comment.author}'s avatar`} 
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-700 rounded-2xl px-3 py-2">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span>{comment.time}</span>
                    <button className="ml-4 hover:underline">Thích</button>
                    <button className="ml-4 hover:underline">Phản hồi</button>
                    {comment.id === 3 && (
                      <span className="ml-auto">
                        <span className="inline-block bg-yellow-500 rounded-full p-1">
                          <span className="sr-only">Emoji</span>
                          😂
                        </span>
                      </span>
                    )}
                    {comment.id === 4 && (
                      <span className="ml-auto">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full">
                          <ThumbsUp size={12} />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {comment.id === 1 && (
                <div className="ml-12 mt-1">
                  <button className="text-xs text-blue-400 flex items-center">
                    <span>Xem tất cả 2 phản hồi</span>
                  </button>
                </div>
              )}
              
              {comment.id === 4 && (
                <div className="ml-12 mt-1">
                  <button className="text-xs text-blue-400 flex items-center">
                    <span>Xem tất cả 3 phản hồi</span>
                  </button>
                </div>
              )}
              
              {comment.id === 5 && (
                <div className="ml-12 mt-1">
                  <button className="text-xs text-blue-400 flex items-center">
                    <span>Xem tất cả 2 phản hồi</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <img src="/api/placeholder/40/40" alt="User avatar" className="w-8 h-8 rounded-full" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Trả lời Kiên Bùi..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-gray-700 rounded-full py-2 pl-4 pr-20 text-sm focus:outline-none"
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
              <button className="text-blue-400">
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupComment;