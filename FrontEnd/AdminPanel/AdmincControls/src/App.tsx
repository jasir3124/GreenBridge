import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Photos from './pages/Photos';
import News from './pages/News';
import Users from './pages/Users';
import QRScanner from './pages/QRScanner';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <Events />;
      case 'photos':
        return <Photos />;
      case 'news':
        return <News />;
      case 'users':
        return <Users />;
      case 'qr-scanner':
        return <QRScanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
      <>
        <div className="min-h-screen bg-gray-50">
        <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
        />

        <div className="lg:ml-64">
          <Header
              setSidebarOpen={setSidebarOpen}
              currentPage={currentPage}
          />

          <main className="p-4 lg:p-8">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
      </>

  );
}

export default App;
