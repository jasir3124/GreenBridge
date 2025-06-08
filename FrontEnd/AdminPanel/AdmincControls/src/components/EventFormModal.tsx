import React, { useRef } from 'react';

const EventFormModal = ({ event, onClose, onSuccess, ipAddress }) => {
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const method = event ? 'PUT' : 'POST';
        const url = event
            ? `http://${ipAddress}:5000/api/event/updateEvent/${event.id}`
            : `http://${ipAddress}:5000/api/event/createEvent`;

        try {
            const res = await fetch(url, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to save event');

            const data = await res.json();
            onSuccess(data);
            onClose();
        } catch (err) {
            alert('Error saving event: ' + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {event ? 'Edit Event' : 'Add New Event'}
                    </h3>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4" encType="multipart/form-data">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={event?.title || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            defaultValue={event?.category || 'Renewable Energy'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="Renewable Energy">Renewable Energy</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Waste Reduction">Waste Reduction</option>
                            <option value="Biodiversity">Biodiversity</option>
                        </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                name="date"
                                type="date"
                                required
                                defaultValue={event?.date ? event.date.split('T')[0] : ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                                name="time"
                                type="time"
                                required
                                defaultValue={event?.time || ''}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            name="location"
                            type="text"
                            required
                            defaultValue={event?.location || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            required
                            defaultValue={event?.description || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                        <input
                            name="maxParticipants"
                            type="number"
                            min="1"
                            required
                            defaultValue={event?.maxParticipants || 50}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {event && (
                            <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            {event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventFormModal;
