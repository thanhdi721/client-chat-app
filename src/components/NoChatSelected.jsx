import { ThumbsUp, MessageSquare, Share2, Trash2, X, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ComponentCreatePost from "./ComponentCreatePost";
import avatar from "../../public/avatar.png";
import heart from "../../public/tim.svg";
import { useAuthStore } from "../store/useAuthStore";

import { fetchAllPosts, deletePost } from "../store/usePost";

export default function SocialMediaPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const menuRef = useRef(null);
  const { authUser } = useAuthStore();

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);
      setOpenMenuId(null);
      setPosts(posts.filter(post => post.id !== postId));
      loadPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message);
      alert('Không thể xóa bài viết người khác');
    }
  };

  const loadPosts = async () => {
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <div className="h-[calc(100vh-120px)] flex items-center justify-center text-gray-500">Loading posts...</div>;
  if (error) return <div className="h-[calc(100vh-120px)] flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto flex-1 flex flex-col scrollbar-hide">
      <ComponentCreatePost onPostSuccess={loadPosts} />
      <div className="space-y-4 pb-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl shadow-md overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={post?.author?.profilePic || avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">{post?.author?.fullName}</h3>
                    <svg className="ml-1 h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">{post?.timestamp}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {authUser?._id === post?.author?._id && (
                  <div className="relative" ref={menuRef}>
                    <button 
                      className="h-8 w-8"
                      onClick={() => setOpenMenuId(openMenuId === post?.id ? null : post?.id)}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" onClick={() => handleDelete(post?.id)} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 pb-2">
              <p className="text-sm text-gray-800">{post.content}</p>
            </div>

            {post.images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1 px-4">
                {post.images.slice(0, 4).map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img.src} 
                    alt={img.alt} 
                    className="object-cover w-full rounded-md cursor-pointer hover:opacity-90 transition-opacity" 
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}

            <div className="px-4 py-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="rounded-full p-1"><img src={heart} alt="heart" className="h-6 w-6 text-white" /></div>
                  <span>{post.likes}</span>
                </div>
                <div>{post.comments} bình luận</div>
              </div>
            </div>

            <div className="px-2 py-1 border-t border-gray-200 flex justify-between">
              <button className="flex-1 py-1 flex items-center justify-center"><Heart className="h-5 w-5 mr-1" />Thích</button>
              <button className="flex-1 py-1 flex items-center justify-center"><MessageSquare className="h-5 w-5 mr-1" />Bình luận</button>
              <button className="flex-1 py-1 flex items-center justify-center"><Share2 className="h-5 w-5 mr-1" />Chia sẻ</button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}