const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Event = require('../Models/Events');

// Dashboard stats and data endpoint
router.get('/dashboard-stats', async (req, res) => {
    try {
        // Get current date for filtering
        const now = new Date();
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Parallel queries for better performance
        const [
            totalUsers,
            activeEvents,
            totalGreenPoints,
            pendingPhotos,
            monthlyTrend,
            categoryData,
            recentEvents,
            topUsers
        ] = await Promise.all([
            // Total users count
            User.countDocuments(),

            // Active events (upcoming and ongoing)
            Event.countDocuments({
                status: { $in: ['upcoming', 'ongoing'] }
            }),

            // Total green points across all users
            User.aggregate([
                { $group: { _id: null, total: { $sum: '$greenPoints' } } }
            ]),

            // Pending photos count
            Event.aggregate([
                { $unwind: '$userSubmittedPhotos' },
                { $match: { 'userSubmittedPhotos.approved': false } },
                { $count: 'pendingPhotos' }
            ]),

            // Monthly trend data (last 6 months)
            Event.aggregate([
                {
                    $match: {
                        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        events: { $sum: 1 },
                        participants: { $sum: { $size: '$attendees' } }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),

            // Category distribution
            Event.aggregate([
                { $unwind: '$category' },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]),

            // Recent events (last 10)
            Event.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title date attendees status createdAt')
                .populate('attendees', 'fullName'),

            // Top users by green points
            User.find()
                .sort({ greenPoints: -1 })
                .limit(10)
                .select('fullName greenPoints attendedEvents avatarUrl')
        ]);

        // Process monthly trend data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const processedMonthlyTrend = monthlyTrend.map(item => ({
            month: monthNames[item._id.month - 1],
            events: item.events,
            participants: item.participants
        }));

        // Process category data with colors
        const categoryColors = {
            'Renewable Energy': '#10B981',
            'Waste Reduction': '#3B82F6',
            'Climate Action': '#8B5CF6',
            'Biodiversity': '#F59E0B',
            'Sustainability': '#EF4444',
            'Water Conservation': '#06B6D4',
            'Green Technology': '#84CC16'
        };

        const totalEvents = categoryData.reduce((sum, cat) => sum + cat.count, 0);
        const processedCategoryData = categoryData.map(cat => ({
            name: cat._id,
            value: Math.round((cat.count / totalEvents) * 100),
            color: categoryColors[cat._id] || '#6B7280'
        }));

        // Process recent events
        const processedRecentEvents = recentEvents.map(event => ({
            id: event._id,
            title: event.title,
            date: event.date.toISOString().split('T')[0],
            participants: event.attendees.length,
            status: event.status
        }));

        // Process top users
        const processedTopUsers = topUsers.map((user, index) => ({
            id: user._id,
            name: user.fullName,
            points: user.greenPoints,
            events: user.attendedEvents.length,
            avatar: user.avatarUrl || user.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
            rank: index + 1
        }));

        // Calculate trends (comparing with previous month)
        const previousMonthUsers = await User.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                $lt: firstDayOfMonth
            }
        });

        const previousMonthEvents = await Event.countDocuments({
            createdAt: {
                $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                $lt: firstDayOfMonth
            }
        });

        const currentMonthUsers = await User.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        const currentMonthEvents = await Event.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        // Calculate percentage changes
        const userTrend = previousMonthUsers > 0
            ? Math.round((currentMonthUsers / previousMonthUsers) * 100)
            : 0;

        const eventTrend = previousMonthEvents > 0
            ? Math.round((currentMonthEvents / previousMonthEvents) * 100)
            : 0;

        // Build response
        const dashboardData = {
            stats: {
                totalUsers: {
                    value: totalUsers.toLocaleString(),
                    trend: { value: userTrend, isPositive: userTrend > 0 }
                },
                activeEvents: {
                    value: activeEvents.toString(),
                    trend: { value: eventTrend, isPositive: eventTrend > 0 }
                },
                pendingPhotos: {
                    value: pendingPhotos.length > 0 ? pendingPhotos[0].pendingPhotos.toString() : '0'
                },
                totalGreenPoints: {
                    value: totalGreenPoints.length > 0
                        ? totalGreenPoints[0].total.toLocaleString()
                        : '0',
                    trend: { value: 15, isPositive: true } // You might want to calculate this dynamically
                }
            },
            charts: {
                monthlyTrend: processedMonthlyTrend,
                categoryData: processedCategoryData
            },
            tables: {
                recentEvents: processedRecentEvents,
                topUsers: processedTopUsers
            }
        };

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            data: dashboardData
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Additional endpoint for real-time stats
router.get('/dashboard-stats/realtime', async (req, res) => {
    try {
        const [totalUsers, activeEvents, pendingPhotos] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments({ status: { $in: ['upcoming', 'ongoing'] } }),
            Event.aggregate([
                { $unwind: '$userSubmittedPhotos' },
                { $match: { 'userSubmittedPhotos.approved': false } },
                { $count: 'pendingPhotos' }
            ])
        ]);

        res.status(200).json({
            message: 'Real-time stats retrieved successfully',
            data: {
                totalUsers,
                activeEvents,
                pendingPhotos: pendingPhotos.length > 0 ? pendingPhotos[0].pendingPhotos : 0,
                lastUpdated: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error fetching real-time stats:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Endpoint for monthly trends (more detailed)
router.get('/dashboard-stats/trends/:months', async (req, res) => {
    try {
        const months = parseInt(req.params.months) || 6;
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

        const monthlyData = await Event.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    events: { $sum: 1 },
                    participants: { $sum: { $size: '$attendees' } },
                    totalPoints: { $sum: '$greenPoints' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const processedData = monthlyData.map(item => ({
            month: monthNames[item._id.month - 1],
            year: item._id.year,
            events: item.events,
            participants: item.participants,
            totalPoints: item.totalPoints
        }));

        res.status(200).json({
            message: 'Monthly trends retrieved successfully',
            data: processedData
        });

    } catch (error) {
        console.error('Error fetching monthly trends:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Endpoint for leaderboard (extended top users)
router.get('/dashboard-stats/leaderboard/:limit', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || 50;

        const topUsers = await User.find()
            .sort({ greenPoints: -1 })
            .limit(limit)
            .select('fullName greenPoints attendedEvents registeredEvents avatarUrl createdAt');

        const processedUsers = topUsers.map((user, index) => ({
            id: user._id,
            rank: index + 1,
            name: user.fullName,
            points: user.greenPoints,
            eventsAttended: user.attendedEvents.length,
            eventsRegistered: user.registeredEvents.length,
            avatar: user.avatarUrl || user.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
            memberSince: user.createdAt
        }));

        res.status(200).json({
            message: 'Leaderboard retrieved successfully',
            data: processedUsers
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;