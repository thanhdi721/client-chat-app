import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    // Thay đổi sidebar từ dọc sang ngang trên mobile
    <aside className="w-full md:h-full md:w-20 lg:w-72 border-t md:border-t-0 md:border-r border-base-300 flex flex-col md:flex-col transition-all duration-200 fixed top-16 left-0">
      <div className="border-b border-base-300 w-full p-3 md:p- ">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium lg:block">Liên hệ</span>
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

      {/* Chuyển từ danh sách dọc sang danh sách ngang cho mobile */}
      <div className="overflow-x-auto md:overflow-x-visible md:overflow-y-auto w-full py-2 md:py-3">
        <div className="flex md:flex-col">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                p-2 md:p-3 flex flex-col md:flex-row items-center gap-1 md:gap-3
                hover:bg-base-300 transition-colors min-w-[80px] md:min-w-0 md:w-full
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

              {/* User info - hiển thị trên cả mobile và desktop */}
              <div className="text-center md:text-left md:min-w-0">
                <div className="font-medium text-xs md:text-base truncate w-full max-w-[70px] md:max-w-none">
                  {user.fullName}
                </div>
                <div className="text-xs text-zinc-400 hidden md:block">
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