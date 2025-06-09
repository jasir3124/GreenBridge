import React, {useEffect, useState} from 'react';
import {Plus, Edit2, Trash2, Send,} from 'lucide-react';
import axios from "axios";

interface NewsItem {
    id: number;
    title: string;
    content: string;
    publishDate: string;
    status: 'draft' | 'published';
    category: string;
    image: string;
}

const News: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [News, setNews] = useState()
    useEffect(() => {
        axios.get('http://localhost:5000/api/news')
            .then(res => setNews(res.data))
            .catch(err => console.error('Failed to fetch news:', err));
    }, []);
    // const [news, setNews] = useState<NewsItem[]>([
    //   {
    //     id: 1,
    //     title: 'EU Green Deal: New Funding Opportunities for Youth Organizations',
    //     content: 'The European Commission has announced new funding opportunities specifically designed for youth-led environmental initiatives. This program aims to support young entrepreneurs and activists in developing sustainable solutions for climate challenges.',
    //     publishDate: '2024-01-15',
    //     status: 'published',
    //     category: 'EU Green Deal',
    //     image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400'
    //   },
    //   {
    //     id: 2,
    //     title: 'Portugal Leads in Renewable Energy Innovation',
    //     content: 'Portugal has achieved a new milestone in renewable energy production, with 95% of electricity generated from renewable sources in December 2023. This achievement demonstrates the country\'s commitment to the EU Green Deal objectives.',
    //     publishDate: '2024-01-18',
    //     status: 'published',
    //     category: 'Renewable Energy',
    //     image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    //   },
    //   {
    //     id: 3,
    //     title: 'Upcoming Climate Action Summit in Lisbon',
    //     content: 'Join us for the biggest climate action summit in Portugal, bringing together young leaders, policymakers, and environmental activists to discuss the future of sustainable development.',
    //     publishDate: '2024-01-20',
    //     status: 'draft',
    //     category: 'Events',
    //     image: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400'
    //   }
    // ]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('category', category);
        formData.append('publishDate', new Date().toISOString());
        formData.append('image', selectedImageFile); // <input type="file" />

        try {
            await axios.post('http://localhost:5000/api/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(false);
            fetchNews(); // re-fetch list
        } catch (err) {
            console.error('Create failed:', err);
        }
    };


    const handleEditNews = (newsItem: NewsItem) => {
        setSelectedNews(newsItem);
        setShowModal(true);
    };

    const handleDeleteNews = async (newsId: string) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await axios.delete(`http://localhost:5000/api/news/${newsId}`);
                setNews(news.filter(item => item._id !== newsId)); // _id from MongoDB
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };


    const handlePublish = (newsId: number) => {
        setNews(news.map(item =>
            item.id === newsId ? {...item, status: 'published' as const} : item
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
                    <p className="text-gray-600 mt-1">Manage news articles and announcements</p>
                </div>
                <button
                    onClick={handleAddNews}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Add News Article
                </button>
            </div>

            {/* News List */}
            <div className="space-y-6">
                {news.map((item) => (
                    <div key={item.id}
                         className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="md:flex">
                            <div className="md:w-48 h-48 md:h-auto">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        {item.status === 'draft' && (
                                            <button
                                                onClick={() => handlePublish(item.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Publish"
                                            >
                                                <Send className="h-4 w-4"/>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEditNews(item)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit2 className="h-4 w-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNews(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                    <span>{item.publishDate}</span>
                                    <span
                                        className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                                </div>

                                <p className="text-gray-600 line-clamp-3">{item.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit News Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedNews ? 'Edit News Article' : 'Add New News Article'}
                            </h3>
                        </div>

                        <form className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    defaultValue={selectedNews?.title || ''}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>EU Green Deal</option>
                                        <option>Renewable Energy</option>
                                        <option>Climate Action</option>
                                        <option>Events</option>
                                        <option>Youth Programs</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image
                                    URL</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                    defaultValue={selectedNews?.image || ''}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                                <textarea
                                    rows={12}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Write your news article content here..."
                                    defaultValue={selectedNews?.content || ''}
                                />
                            </div>
                        </form>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                Publish Article
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default News;
