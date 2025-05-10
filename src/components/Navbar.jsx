import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Sidebar from "./SidebarMobile";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  // State để kiểm soát việc hiển thị drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Hàm để đóng/mở drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <header
        className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
      >
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg font-bold">SkyRain</h1>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button 
                className="btn btn-sm gap-2 transition-colors md:hidden"
                onClick={toggleDrawer}
              >
                {isDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <Link
                to={"/settings"}
                className="btn btn-sm gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Cài đặt</span>
              </Link>

              {authUser && (
                <>
                  <Link to={"/profile"} className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">{authUser?.fullName}</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer overlay - hiển thị khi drawer mở */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleDrawer} 
        />
      )}

      {/* Drawer sidebar - truyền props isDrawerOpen và toggleDrawer */}
      <div className={`
        fixed left-0 h-[calc(100vh)] z-50 w-64 
        transform transition-transform duration-300 ease-in-out md:hidden
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isDrawerOpen={isDrawerOpen} onClose={toggleDrawer} />
      </div>
    </>
  );
};
export default Navbar;