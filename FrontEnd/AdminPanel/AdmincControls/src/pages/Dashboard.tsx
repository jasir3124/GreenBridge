import React from 'react';
import { Users, Calendar, Camera, Award } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const eventData = [
    { month: 'Jan', events: 12, participants: 340 },
    { month: 'Feb', events: 18, participants: 520 },
    { month: 'Mar', events: 22, participants: 680 },
    { month: 'Apr', events: 25, participants: 750 },
    { month: 'May', events: 30, participants: 920 },
    { month: 'Jun', events: 35, participants: 1200 },
  ];

  const categoryData = [
    { name: 'Renewable Energy', value: 35, color: '#10B981' },
    { name: 'Waste Reduction', value: 25, color: '#3B82F6' },
    { name: 'Climate Action', value: 20, color: '#8B5CF6' },
    { name: 'Biodiversity', value: 20, color: '#F59E0B' },
  ];

  const recentEvents = [
    { id: 1, title: 'Solar Panel Workshop', date: '2024-01-15', participants: 45, status: 'completed' },
    { id: 2, title: 'Green Transportation Summit', date: '2024-01-18', participants: 120, status: 'ongoing' },
    { id: 3, title: 'Urban Gardening Initiative', date: '2024-01-20', participants: 35, status: 'upcoming' },
    { id: 4, title: 'Circular Economy Forum', date: '2024-01-22', participants: 80, status: 'upcoming' },
  ];

  const topUsers = [
    { id: 1, name: 'Maria Santos', points: 2450, events: 18, avatar: 'MS' },
    { id: 2, name: 'João Silva', points: 2100, events: 15, avatar: 'JS' },
    { id: 3, name: 'Ana Costa', points: 1890, events: 14, avatar: 'AC' },
    { id: 4, name: 'Pedro Lima', points: 1650, events: 12, avatar: 'PL' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="2,847"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Active Events"
          value="35"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Photos Pending"
          value="127"
          icon={Camera}
          color="orange"
        />
        <StatsCard
          title="Total GreenPoints"
          value="45,230"
          icon={Award}
          trend={{ value: 15, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Participation Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Participation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="participants" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Events and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} • {event.participants} participants</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'completed' ? 'bg-green-100 text-green-800' :
                  event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Leaderboard</button>
          </div>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{user.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.events} events attended</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{user.points}</p>
                  <p className="text-xs text-gray-500">GreenPoints</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
