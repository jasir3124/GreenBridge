import React, { useEffect, useState } from 'react';
import { Check, X, Eye, Filter } from 'lucide-react';
import axios from 'axios';

interface Photo {
  id: string;           // from photo._id in backend
  eventId: string;      // from event._id in backend
  eventTitle: string;
  userName: string;
  submittedAt: string;  // rename to match backend
  imageUrl: string;
  status: 'pending' | 'accepted' | 'rejected';  // align with backend enum
}



const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const ipAddress = import.meta.env.VITE_IP_ADDRESS

  // Fetch photos from backend on mount
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://${ipAddress}:5000/api/photos/photos`);
        setPhotos(res.data);
      } catch (err) {
        console.error('Failed to load photos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Filter photos by selected status
  const filteredPhotos = photos.filter(photo =>
      selectedFilter === 'all' ? true : photo.status === selectedFilter
  );

  // Update photo status via backend
  const updatePhotoStatus = async (eventId: string, photoId: string, status: 'pending' | 'accepted' | 'rejected') => {
    try {
      const res = await axios.patch(`http://${ipAddress}:5000/api/photos/photos/${eventId}/${photoId}`, {
        status,
      });

      setPhotos(prev =>
          prev.map(p =>
              p.id === photoId ? { ...p, status: res.data.photo.status } : p
          )
      );
    } catch (err) {
      console.error('Failed to update photo status:', err);
    }
  };

  const handleApprove = (photo: Photo) => {
    updatePhotoStatus(photo.eventId, photo.id, 'accepted');
    if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
  };

  const handleReject = (photo: Photo) => {
    updatePhotoStatus(photo.eventId, photo.id, 'rejected');
    if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
  };

  const getStatusColor = (status: Photo['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilterCount = (status: 'all' | Photo['status']) => {
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
            { key: 'rejected', label: 'Rejected' },
          ].map(filter => (
              <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      selectedFilter === filter.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {filter.label} ({getFilterCount(filter.key as any)})
              </button>
          ))}
        </div>

        {/* Photos Grid */}
        {loading ? (
            <p className="text-center py-12 text-gray-600">Loading photos...</p>
        ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600">No photos match the selected filter criteria.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map(photo => (
                  <div
                      key={photo.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                          src={photo.imageUrl}
                          alt={`Photo from event ${photo.eventTitle}`}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                      />
                      <div className="absolute top-2 right-2">
                  <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          photo.status
                      )}`}
                  >
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

                      {photo.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleApprove(photo)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                                onClick={() => handleReject(photo)}
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
        )}

        {/* Photo Preview Modal */}
        {selectedPhoto && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedPhoto.eventTitle}</h3>
                    <p className="text-sm text-gray-600">
                      by {selectedPhoto.userName}
                    </p>
                  </div>
                  <button onClick={() => setSelectedPhoto(null)} className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="max-h-96 overflow-hidden">
                  <img
                      src={selectedPhoto.imageUrl}
                      alt={`Photo from event ${selectedPhoto.eventTitle}`}
                      className="w-full h-full object-contain"
                  />
                </div>

                {selectedPhoto.status === 'pending' && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-4">
                      <button
                          onClick={() => {
                            handleApprove(selectedPhoto);
                            setSelectedPhoto(null);
                          }}
                          className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve Photo
                      </button>
                      <button
                          onClick={() => {
                            handleReject(selectedPhoto);
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
