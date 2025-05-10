import { useState, useRef } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import Modal from './Modal';
import { useCreatePost } from '../store/useCreatePost';
import { toast } from 'react-toastify';

export default function FacebookPostInput({ onPostSuccess }) {
  const [postText, setPostText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { authUser } = useAuthStore();
  const { createPost } = useCreatePost();

  const handleClose = () => {
    setIsModalOpen(false);
    setPostText('');
    setSelectedFiles([]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const imagePromises = selectedFiles.map(file =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ src: reader.result, alt: file.name });
          reader.readAsDataURL(file);
        })
      );

      const formattedImages = await Promise.all(imagePromises);

      const postData = {
        content: postText,
        images: formattedImages
      };

      await createPost(postData);
      if (onPostSuccess) await onPostSuccess();
      toast.success('Đăng bài viết thành công!');
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Lỗi khi tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-3">
          <img src={authUser.profilePic} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-600" />
          <button onClick={() => setIsModalOpen(true)} className="flex-1 bg-gray-200 rounded-full px-4 py-2 text-left">
            <input type="text" placeholder={`${authUser.fullName}, bạn đang nghĩ gì thế?`} className="w-full bg-transparent text-black outline-none" readOnly />
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <div className="px-4 py-2">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={`${authUser.fullName} ơi, bạn đang nghĩ gì thế?`}
            className="w-full h-32 outline-none resize-none text-lg"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="px-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                  <button onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-3 flex justify-end gap-2 w-full">
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 w-full rounded-md font-medium ${postText.trim() || selectedFiles.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            disabled={!postText.trim() && selectedFiles.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang đăng...
              </div>
            ) : 'Đăng'}
          </button>
          <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])} accept="image/*" multiple className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-gray-100 rounded-full">
            <img src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png" alt="Add" className="w-6 h-6" />
          </button>
        </div>
      </Modal>
    </>
  );
}
