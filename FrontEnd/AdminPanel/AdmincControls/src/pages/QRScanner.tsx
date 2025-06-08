import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Scan, Camera, Users } from 'lucide-react';

interface CheckInRecord {
  id: number;
  userName: string;
  eventTitle: string;
  checkInTime: string;
  pointsAwarded: number;
  status: 'success' | 'error';
}

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([
    {
      id: 1,
      userName: 'Maria Santos',
      eventTitle: 'Solar Panel Workshop',
      checkInTime: '2024-01-15 14:30:22',
      pointsAwarded: 100,
      status: 'success'
    },
    {
      id: 2,
      userName: 'João Silva',
      eventTitle: 'Green Transportation Summit',
      checkInTime: '2024-01-18 09:15:10',
      pointsAwarded: 150,
      status: 'success'
    },
    {
      id: 3,
      userName: 'Ana Costa',
      eventTitle: 'Urban Gardening Initiative',
      checkInTime: '2024-01-20 10:45:33',
      pointsAwarded: 75,
      status: 'success'
    }
  ]);

  const handleStartScanning = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Simulate successful check-in
      const newCheckIn: CheckInRecord = {
        id: recentCheckIns.length + 1,
        userName: 'Pedro Lima',
        eventTitle: 'Climate Action Workshop',
        checkInTime: new Date().toLocaleString('en-GB'),
        pointsAwarded: 120,
        status: 'success'
      };
      setRecentCheckIns([newCheckIn, ...recentCheckIns]);
    }, 3000);
  };

  const todayCheckIns = recentCheckIns.filter(checkIn => 
    checkIn.checkInTime.startsWith(new Date().toISOString().split('T')[0])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
        <p className="text-gray-600 mt-1">Scan participant QR codes to validate event attendance</p>
      </div>

      {/* Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <QrCode className="h-5 w-5 text-green-600 mr-2" />
            QR Code Scanner
          </h3>
          
          <div className="text-center">
            <div className={`w-64 h-64 mx-auto rounded-lg border-2 border-dashed ${
              isScanning ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
            } flex items-center justify-center mb-6`}>
              {isScanning ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-green-600 font-medium">Scanning...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Camera preview</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleStartScanning}
              disabled={isScanning}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isScanning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Scan className="h-5 w-5 mr-2" />
              {isScanning ? 'Scanning...' : 'Start Scanning'}
            </button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            Today's Check-ins
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{todayCheckIns.length}</div>
              <div className="text-sm text-green-700">Total Check-ins</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todayCheckIns.reduce((sum, checkIn) => sum + checkIn.pointsAwarded, 0)}
              </div>
              <div className="text-sm text-blue-700">Points Awarded</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recent Activity</h4>
            {todayCheckIns.length === 0 ? (
              <p className="text-gray-500 text-sm">No check-ins today yet</p>
            ) : (
              todayCheckIns.slice(0, 3).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {checkIn.userName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{checkIn.userName}</p>
                      <p className="text-xs text-gray-500">{checkIn.checkInTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+{checkIn.pointsAwarded}</p>
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Check-ins History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Check-in History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points Awarded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCheckIns.map((checkIn) => (
                <tr key={checkIn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {checkIn.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{checkIn.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{checkIn.eventTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{checkIn.checkInTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">+{checkIn.pointsAwarded}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {checkIn.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`ml-2 text-sm ${
                        checkIn.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {checkIn.status === 'success' ? 'Success' : 'Error'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;