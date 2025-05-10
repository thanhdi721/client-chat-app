import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import SocialMediaPost from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="">
      <div className="flex items-center justify-center pt-20 px-4 ">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl">
        <div className="flex flex-col md:flex-row h-full rounded-lg">
            {/* Container cho phần nội dung chính - full height trên mobile */}
            <div className="flex-1 flex flex-col order-1 md:order-2">
              {!selectedUser ? <SocialMediaPost /> : <ChatContainer />}
            </div>
            
            {/* Sidebar - thay đổi vị trí sử dụng order trong flexbox */}
            <div className="order-2 md:order-1 hidden md:block">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
