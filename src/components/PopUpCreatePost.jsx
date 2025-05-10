import { useState } from 'react';
import { X, Image, Users, Smile, MapPin, GifSquare, MoreHorizontal } from 'lucide-react';

export default function FacebookPostModal({ onClose }) {
  const [postText, setPostText] = useState('');

  const closeModal = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="w-8"></div> {/* Empty div for alignment */}
          <h2 className="text-xl font-medium text-center">Tạo bài viết</h2>
          <button onClick={closeModal} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300">
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 flex items-center space-x-2">
          <div className="relative">
            <img 
              src="/api/placeholder/40/40" 
              alt="User avatar" 
              className="w-10 h-10 rounded-full object-cover border border-gray-300" 
            />
          </div>
          <div>
            <p className="font-medium">Phan Thanh Dĩ</p>
            <div className="flex items-center text-xs bg-gray-100 rounded px-2 py-1">
              <span className="font-medium">Công khai</span>
              <span className="ml-1">▼</span>
            </div>
          </div>
        </div>

        {/* Post content textarea */}
        <div className="px-4 py-2">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Phan Thanh ơi, bạn đang nghĩ gì thế?"
            className="w-full h-32 outline-none resize-none text-lg"
          />
          
          {/* AI suggestion button */}
          <div className="flex justify-end mb-2">
            <div className="bg-gray-100 rounded-full p-1 flex items-center justify-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add to your post */}
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-3">Thêm vào bài viết của bạn</p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <Image size={24} className="text-green-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <Users size={24} className="text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <Smile size={24} className="text-yellow-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <MapPin size={24} className="text-red-500" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <GifSquare size={24} className="text-teal-500" />
                </button>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <MoreHorizontal size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Post button */}
        <div className="px-4 py-3">
          <button 
            className={`w-full py-2 rounded-md font-medium ${
              postText.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!postText.trim()}
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}