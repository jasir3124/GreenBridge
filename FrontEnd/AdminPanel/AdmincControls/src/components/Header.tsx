import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, currentPage }) => {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard Overview';
      case 'events': return 'Event Management';
      case 'photos': return 'Photo Approvals';
      case 'news': return 'News & Updates';
      case 'users': return 'Users & Leaderboard';
      case 'qr-scanner': return 'QR Scanner';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-64"
            />
          </div>
          
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;