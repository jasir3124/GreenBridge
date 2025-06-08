import React, { useState } from 'react';
import { Check, X, Eye, Filter } from 'lucide-react';

interface Photo {
  id: number;
  eventTitle: string;
  userName: string;
  uploadedAt: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

const Photos: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      eventTitle: 'Solar Panel Workshop',
      userName: 'Maria Santos',
      uploadedAt: '2024-01-15 16:30',
      imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'pending'
    },
    {
      id: 2,
      eventTitle: 'Green Transportation Summit',
      userName: 'João Silva',
      uploadedAt: '2024-01-18 11:20',
      imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'pending'
    },
    {
      id: 3,
      eventTitle: 'Urban Gardening Initiative',
      userName: 'Ana Costa',
      uploadedAt: '2024-01-20 14:45',
      imageUrl: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'approved'
    },
    {
      id: 4,
      eventTitle: 'Renewable Energy Fair',
      userName: 'Pedro Lima',
      uploadedAt: '2024-01-22 09:15',
      imageUrl: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'pending'
    },
    {
      id: 5,
      eventTitle: 'Climate Action Workshop',
      userName: 'Sofia Rodrigues',
      uploadedAt: '2024-01-23 13:00',
      imageUrl: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'rejected'
    }
  ]);

  const filteredPhotos = photos.filter(photo => 
    selectedFilter === 'all' ? true : photo.status === selectedFilter
  );

  const handleApprove = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, status: 'approved' as const } : photo
    ));
  };

  const handleReject = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, status: 'rejected' as const } : photo
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilterCount = (status: string) => {
    if (status === 'all') return photos.length;
    return photos.filter(photo => photo.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Photo Approvals</h2>
        <p className="text-gray-600 mt-1">Review and approve user-uploaded event photos</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All Photos' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedFilter === filter.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.label} ({getFilterCount(filter.key)})
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative">
              <img
                src={photo.imageUrl}
                alt="Event photo"
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(photo.status)}`}>
                  {photo.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200"
              >
                <Eye className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{photo.eventTitle}</h3>
              <p className="text-sm text-gray-600 mb-2">by {photo.userName}</p>
              <p className="text-xs text-gray-500 mb-3">{photo.uploadedAt}</p>
              
              {photo.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(photo.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(photo.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600">No photos match the selected filter criteria.</p>
        </div>
      )}

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedPhoto.eventTitle}</h3>
                <p className="text-sm text-gray-600">by {selectedPhoto.userName} • {selectedPhoto.uploadedAt}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt="Event photo"
                className="w-full h-full object-contain"
              />
            </div>
            
            {selectedPhoto.status === 'pending' && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    handleApprove(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Photo
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;