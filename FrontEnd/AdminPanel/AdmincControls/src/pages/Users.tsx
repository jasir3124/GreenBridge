import React, { useState } from 'react';
import { Search, Award, Calendar, MapPin, Mail, Phone, Filter } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  greenPoints: number;
  eventsAttended: number;
  eventsRegistered: number;
  location: string;
  status: 'active' | 'inactive';
  avatar: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'points' | 'events'>('points');
  
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 912 345 678',
      joinDate: '2023-08-15',
      greenPoints: 2450,
      eventsAttended: 18,
      eventsRegistered: 22,
      location: 'Lisbon, Portugal',
      status: 'active',
      avatar: 'MS'
    },
    {
      id: 2,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+351 923 456 789',
      joinDate: '2023-09-22',
      greenPoints: 2100,
      eventsAttended: 15,
      eventsRegistered: 18,
      location: 'Porto, Portugal',
      status: 'active',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '+351 934 567 890',
      joinDate: '2023-07-10',
      greenPoints: 1890,
      eventsAttended: 14,
      eventsRegistered: 16,
      location: 'Coimbra, Portugal',
      status: 'active',
      avatar: 'AC'
    },
    {
      id: 4,
      name: 'Pedro Lima',
      email: 'pedro.lima@email.com',
      phone: '+351 945 678 901',
      joinDate: '2023-10-05',
      greenPoints: 1650,
      eventsAttended: 12,
      eventsRegistered: 15,
      location: 'Braga, Portugal',
      status: 'active',
      avatar: 'PL'
    },
    {
      id: 5,
      name: 'Sofia Rodrigues',
      email: 'sofia.rodrigues@email.com',
      phone: '+351 956 789 012',
      joinDate: '2023-11-18',
      greenPoints: 1420,
      eventsAttended: 10,
      eventsRegistered: 12,
      location: 'Faro, Portugal',
      status: 'inactive',
      avatar: 'SR'
    },
    {
      id: 6,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      phone: '+351 967 890 123',
      joinDate: '2023-06-03',
      greenPoints: 1320,
      eventsAttended: 9,
      eventsRegistered: 11,
      location: 'Aveiro, Portugal',
      status: 'active',
      avatar: 'CF'
    }
  ]);

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'points':
          return b.greenPoints - a.greenPoints;
        case 'events':
          return b.eventsAttended - a.eventsAttended;
        default:
          return 0;
      }
    });

  const topUsers = users
    .sort((a, b) => b.greenPoints - a.greenPoints)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users & Leaderboard</h2>
        <p className="text-gray-600 mt-1">Manage users and track engagement metrics</p>
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 text-green-600 mr-2" />
          Top Contributors Leaderboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topUsers.slice(0, 5).map((user, index) => (
            <div key={user.id} className="text-center">
              <div className="relative">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}>
                  {user.avatar}
                </div>
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-600' :
                  index === 1 ? 'bg-gray-500' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-green-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mt-2">{user.name}</h4>
              <p className="text-sm text-green-600 font-semibold">{user.greenPoints} pts</p>
              <p className="text-xs text-gray-500">{user.eventsAttended} events</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="points">GreenPoints</option>
              <option value="events">Events Attended</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GreenPoints
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{user.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail className="h-3 w-3 mr-2" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">{user.greenPoints}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.eventsAttended} attended</div>
                    <div className="text-sm text-gray-500">{user.eventsRegistered} registered</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">No users match the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Users;