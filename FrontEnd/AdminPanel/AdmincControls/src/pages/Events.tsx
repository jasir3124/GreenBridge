import React, {useEffect, useState, useRef} from 'react';
import { Plus, Edit2, Trash2, MapPin, Users, Calendar, } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  image: string;
}

const Events: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Form refs for handling form data
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/event/getAllEvents`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch events.");
          }
          return res.json();
        })
        .then((data: Event[]) => {
          setEvents(data.data);
            console.log(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const method = selectedEvent ? 'PUT' : 'POST';
    const url = selectedEvent
        ? `http://localhost:5000/api/event/updateEvent/${selectedEvent.id}`
        : 'http://localhost:5000/api/event/createEvent';

    fetch(url, {
      method,
      body: formData, // Send as FormData to handle file upload
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to save event');
          }
          return res.json();
        })
        .then((data) => {
          if (selectedEvent) {
            setEvents(events.map(ev => ev.id === data.id ? data : ev));
          } else {
            setEvents([...events, data]);
          }
          setShowModal(false);
          fetchEvents(); // Refresh the list
        })
        .catch((err) => {
          console.error('Error saving event:', err);
          alert('Error saving event: ' + err.message);
        });
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      fetch(`http://localhost:5000/api/event/${eventId}`, { method: 'DELETE' })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to delete event.");
            setEvents(events.filter(event => event.id !== eventId));
          })
          .catch((err) => {
            console.error('Delete error:', err);
            alert('Error deleting event: ' + err.message);
          });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
            <p className="text-gray-600 mt-1">Create and manage Green Deal events</p>
          </div>
          <button
              onClick={handleAddEvent}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </button>
        </div>

        {loading && (
            <div className="text-center text-gray-500">Loading events...</div>
        )}

        {error && (
            <div className="text-center text-red-500">Error: {error}</div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        // Fallback image if the image fails to load
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Event+Image';
                      }}
                  />
                  <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {event.category}
                </span>
                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Add/Edit Event Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEvent ? 'Edit Event' : 'Add New Event'}
                  </h3>
                </div>

                <form ref={formRef} onSubmit={handleFormSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                      <input
                          name="title"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          defaultValue={selectedEvent?.title || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                          name="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          defaultValue={selectedEvent?.category || 'Renewable Energy'}
                      >
                        <option value="Renewable Energy">Renewable Energy</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Waste Reduction">Waste Reduction</option>
                        <option value="Biodiversity">Biodiversity</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                          name="date"
                          type="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          defaultValue={selectedEvent?.date || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                          name="time"
                          type="time"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          defaultValue={selectedEvent?.time || ''}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        name="location"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        defaultValue={selectedEvent?.location || ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        defaultValue={selectedEvent?.description || ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                    <input
                        name="maxParticipants"
                        type="number"
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        defaultValue={selectedEvent?.maxParticipants || 50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {selectedEvent && (
                        <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      {selectedEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Events;
