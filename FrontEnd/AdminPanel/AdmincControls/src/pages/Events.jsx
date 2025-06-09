import React, {useEffect, useState} from 'react';
import {Plus, Edit2, Trash2, MapPin, Users, Calendar} from 'lucide-react';
import EventFormModal from '../components/EventFormModal';

const Events = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const ipAddress = import.meta.env.VITE_IP_ADDRESS;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        setLoading(true);
        fetch(`http://${ipAddress}:5000/api/event/getAllEvents`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch events.');
                return res.json();
            })
            .then((data) => {
                setEvents(data.data || []);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const handleAddEvent = () => {
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            fetch(`http://${ipAddress}:5000/api/event/deleteEvent/${eventId}`, {method: 'DELETE'})
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to delete event.');
                    setEvents(events.filter((event) => event.id !== eventId));
                })
                .catch((err) => {
                    alert('Error deleting event: ' + err.message);
                });
        }
    };

    const getStatusColor = (status) => {
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

    const handleModalSuccess = (newOrUpdatedEvent) => {
        // if (selectedEvent) {
        //     setEvents(events.map((ev) => (ev.id === newOrUpdatedEvent.id ? newOrUpdatedEvent : ev)));
        // } else {
        //     setEvents([...events, newOrUpdatedEvent]);
        // }

        fetchEvents();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-3xl font-bold">Events</h2>
                <button
                    onClick={handleAddEvent}
                    className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 py-2 rounded-lg flex items-center gap-2 mt-4 sm:mt-0"
                >
                    <Plus size={18}/> Add Event
                </button>
            </div>

            {/* Loading & Error */}
            {loading && <p>Loading events...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {/* Events List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {events.length === 0 && !loading && <p>No events found.</p>}
                {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <span
                                className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
                        </div>

                        <p className="mb-2 text-gray-700">{event.description}</p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar size={16}/>
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin size={16}/>
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users size={16}/>
                                <span>{event.maxParticipants} participants max</span>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-3">
                            <button
                                onClick={() => handleEditEvent(event)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                                <Edit2 size={16}/> Edit
                            </button>
                            <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
                            >
                                <Trash2 size={16}/> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <EventFormModal
                    event={selectedEvent}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleModalSuccess}
                    ipAddress={ipAddress}
                />
            )}
        </div>
    );
};

export default Events;
