import React from 'react';
import { 
  Home, 
  Calendar, 
  Camera, 
  Newspaper, 
  Users, 
  QrCode, 
  Leaf,
  X 
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  isOpen, 
  setIsOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'photos', label: 'Photo Approvals', icon: Camera },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'users', label: 'Users & Leaderboard', icon: Users },
    { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
  ];

  const handleMenuClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GreenBridge</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-green-600' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@greenbridge.eu</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;