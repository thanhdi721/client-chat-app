import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = ({ isDrawerOpen, onClose }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Hàm xử lý khi chọn user từ sidebar trong chế độ drawer
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Đóng drawer khi chọn user (chỉ trên mobile)
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="w-full h-full md:h-full md:w-20 lg:w-72 border-t md:border-t-0 md:border-r border-base-300 flex flex-col md:flex-col transition-all duration-200 bg-base-100">
      <div className="border-b border-base-300 w-full p-3 md:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium block">Liên hệ</span>
        </div>
        {/* Online filter toggle - hiển thị trên cả mobile và desktop */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Hiển thị online</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* Danh sách người dùng - dọc trong drawer và trên desktop, ngang trên mobile không drawer */}
      <div className="overflow-y-auto flex-1 w-full py-2 md:py-3">
        <div className="flex flex-col">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`
                p-3 flex flex-row items-center gap-3
                hover:bg-base-300 transition-colors w-full
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-10 md:size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-2 md:size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info */}
              <div className="text-left min-w-0">
                <div className="font-medium text-base truncate w-full">
                  {user.fullName}
                </div>
                <div className="text-xs text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;