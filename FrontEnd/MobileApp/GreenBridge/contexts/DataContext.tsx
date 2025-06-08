// import React, { createContext, useContext, useState, ReactNode } from 'react';
//
// export interface Event {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   location: string;
//   image: string;
//   maxParticipants: number;
//   currentParticipants: number;
//   category: string;
//   greenPoints: number;
//   isRegistered?: boolean;
//   isAttended?: boolean;
// }
//
// export interface NewsItem {
//   id: string;
//   title: string;
//   summary: string;
//   content: string;
//   image: string;
//   date: string;
//   category: 'green-deal' | 'event' | 'achievement' | 'news';
// }
//
// interface DataContextType {
//   events: Event[];
//   news: NewsItem[];
//   leaderboard: Array<{ id: string; name: string; points: number; avatar?: string }>;
//   registerForEvent: (eventId: string, userId: string) => void;
//   recordAttendance: (eventId: string, userId: string) => void;
// }
//
// const DataContext = createContext<DataContextType | undefined>(undefined);
//
// // Mock data
// const mockEvents: Event[] = [
//   {
//     id: '1',
//     title: 'Clean Energy Workshop',
//     description: 'Learn about renewable energy solutions and sustainable practices for your home and community.',
//     date: '2024-02-15T10:00:00Z',
//     location: 'Europe House, Brussels',
//     image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg',
//     maxParticipants: 50,
//     currentParticipants: 23,
//     category: 'Workshop',
//     greenPoints: 25,
//   },
//   {
//     id: '2',
//     title: 'Urban Gardening Initiative',
//     description: 'Join us in creating green spaces in urban areas. Learn about sustainable gardening techniques.',
//     date: '2024-02-20T14:00:00Z',
//     location: 'Community Center, Brussels',
//     image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
//     maxParticipants: 30,
//     currentParticipants: 18,
//     category: 'Community',
//     greenPoints: 30,
//   },
//   {
//     id: '3',
//     title: 'Climate Action Summit',
//     description: 'A comprehensive summit on climate action strategies and youth engagement in environmental policies.',
//     date: '2024-02-25T09:00:00Z',
//     location: 'European Parliament, Brussels',
//     image: 'https://images.pexels.com/photos/2382336/pexels-photo-2382336.jpeg',
//     maxParticipants: 200,
//     currentParticipants: 156,
//     category: 'Summit',
//     greenPoints: 50,
//   },
//   {
//     id: '4',
//     title: 'Sustainable Transportation Forum',
//     description: 'Explore eco-friendly transportation options and their impact on reducing carbon emissions.',
//     date: '2024-03-05T13:00:00Z',
//     location: 'Green Hub, Brussels',
//     image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
//     maxParticipants: 75,
//     currentParticipants: 42,
//     category: 'Forum',
//     greenPoints: 35,
//   },
//   {
//     id: '5',
//     title: 'Circular Economy Workshop',
//     description: 'Discover how circular economy principles can transform waste into valuable resources.',
//     date: '2024-03-12T09:30:00Z',
//     location: 'Innovation Center, Brussels',
//     image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
//     maxParticipants: 40,
//     currentParticipants: 28,
//     category: 'Workshop',
//     greenPoints: 40,
//   },
//   {
//     id: '6',
//     title: 'Green Technology Expo',
//     description: 'Experience the latest innovations in green technology and sustainable solutions.',
//     date: '2024-03-18T10:00:00Z',
//     location: 'Expo Center, Brussels',
//     image: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg',
//     maxParticipants: 300,
//     currentParticipants: 187,
//     category: 'Expo',
//     greenPoints: 45,
//   },
// ];
//
// const mockNews: NewsItem[] = [
//   {
//     id: '1',
//     title: 'EU Green Deal Reaches New Milestone',
//     summary: 'The European Green Deal has achieved significant progress in renewable energy adoption.',
//     content: 'The European Union has announced remarkable progress in its Green Deal initiative...',
//     image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg',
//     date: '2024-02-10T08:00:00Z',
//     category: 'green-deal',
//   },
//   {
//     id: '2',
//     title: 'Youth Climate Activists Win EU Recognition',
//     summary: 'Young environmental leaders across Europe receive awards for their climate action efforts.',
//     content: 'A group of dedicated youth climate activists have been recognized by the EU...',
//     image: 'https://images.pexels.com/photos/2382336/pexels-photo-2382336.jpeg',
//     date: '2024-02-08T12:00:00Z',
//     category: 'achievement',
//   },
//   {
//     id: '3',
//     title: 'New Funding for Green Innovation Projects',
//     summary: 'The EU announces €2 billion in funding for youth-led environmental innovation projects.',
//     content: 'The European Commission has unveiled a comprehensive funding program...',
//     image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
//     date: '2024-02-05T14:30:00Z',
//     category: 'news',
//   },
//   {
//     id: '4',
//     title: 'Renewable Energy Hits Record High',
//     summary: 'European renewable energy production reaches unprecedented levels this quarter.',
//     content: 'Wind and solar energy production across Europe has reached record-breaking levels...',
//     image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
//     date: '2024-02-03T11:15:00Z',
//     category: 'green-deal',
//   },
// ];
//
// const mockLeaderboard = [
//   { id: '1', name: 'Emma Green', points: 450, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
//   { id: '2', name: 'Alex Nature', points: 380, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
//   { id: '3', name: 'Sofia Earth', points: 320, avatar: 'https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg' },
//   { id: '4', name: 'Marco Climate', points: 290, avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' },
//   { id: '5', name: 'Luna Eco', points: 250, avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg' },
//   { id: '6', name: 'David Forest', points: 220, avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg' },
//   { id: '7', name: 'Maya Ocean', points: 195, avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg' },
//   { id: '8', name: 'Leo Solar', points: 180, avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg' },
// ];
//
// export function DataProvider({ children }: { children: ReactNode }) {
//   const [events, setEvents] = useState<Event[]>(mockEvents);
//   const [news] = useState<NewsItem[]>(mockNews);
//   const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
//
//   const registerForEvent = (eventId: string, userId: string) => {
//     setEvents(prev => prev.map(event =>
//       event.id === eventId
//         ? { ...event, currentParticipants: event.currentParticipants + 1, isRegistered: true }
//         : event
//     ));
//   };
//
//   const recordAttendance = (eventId: string, userId: string) => {
//     // Mark the event as attended
//     setEvents(prev => prev.map(event =>
//       event.id === eventId
//         ? { ...event, isAttended: true }
//         : event
//     ));
//
//     // Award green points to the user
//     const event = events.find(e => e.id === eventId);
//     if (event) {
//       setLeaderboard(prev => prev.map(user =>
//         user.id === userId
//           ? { ...user, points: user.points + event.greenPoints }
//           : user
//       ).sort((a, b) => b.points - a.points)); // Re-sort leaderboard by points
//     }
//   };
//
//   return (
//     <DataContext.Provider value={{
//       events,
//       news,
//       leaderboard,
//       registerForEvent,
//       recordAttendance,
//     }}>
//       {children}
//     </DataContext.Provider>
//   );
// }
//
// export function useData() {
//   const context = useContext(DataContext);
//   if (context === undefined) {
//     throw new Error('useData must be used within a DataProvider');
//   }
//   return context;
// }


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  greenPoints: number;
  isRegistered?: boolean;
  isAttended?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: 'green-deal' | 'event' | 'achievement' | 'news';
}

interface DataContextType {
  events: Event[];
  news: NewsItem[];
  leaderboard: Array<{ id: string; name: string; points: number; avatar?: string }>;
  isLoading: boolean;
  error: string | null;
  registerForEvent: (eventId: string, userId: string) => Promise<boolean>;
  unregisterFromEvent: (eventId: string, userId: string) => Promise<boolean>;
  recordAttendance: (eventId: string, userId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for news and leaderboard (until you have backend routes for these)
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'EU Green Deal Reaches New Milestone',
    summary: 'The European Green Deal has achieved significant progress in renewable energy adoption.',
    content: 'The European Union has announced remarkable progress in its Green Deal initiative...',
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg',
    date: '2024-02-10T08:00:00Z',
    category: 'green-deal',
  },
  {
    id: '2',
    title: 'Youth Climate Activists Win EU Recognition',
    summary: 'Young environmental leaders across Europe receive awards for their climate action efforts.',
    content: 'A group of dedicated youth climate activists have been recognized by the EU...',
    image: 'https://images.pexels.com/photos/2382336/pexels-photo-2382336.jpeg',
    date: '2024-02-08T12:00:00Z',
    category: 'achievement',
  },
  {
    id: '3',
    title: 'New Funding for Green Innovation Projects',
    summary: 'The EU announces €2 billion in funding for youth-led environmental innovation projects.',
    content: 'The European Commission has unveiled a comprehensive funding program...',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    date: '2024-02-05T14:30:00Z',
    category: 'news',
  },
  {
    id: '4',
    title: 'Renewable Energy Hits Record High',
    summary: 'European renewable energy production reaches unprecedented levels this quarter.',
    content: 'Wind and solar energy production across Europe has reached record-breaking levels...',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    date: '2024-02-03T11:15:00Z',
    category: 'green-deal',
  },
];

const mockLeaderboard = [
  { id: '1', name: 'Emma Green', points: 450, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
  { id: '2', name: 'Alex Nature', points: 380, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
  { id: '3', name: 'Sofia Earth', points: 320, avatar: 'https://images.pexels.com/photos/1197132/pexels-photo-1197132.jpeg' },
  { id: '4', name: 'Marco Climate', points: 290, avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' },
  { id: '5', name: 'Luna Eco', points: 250, avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg' },
  { id: '6', name: 'David Forest', points: 220, avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg' },
  { id: '7', name: 'Maya Ocean', points: 195, avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg' },
  { id: '8', name: 'Leo Solar', points: 180, avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [news] = useState<NewsItem[]>(mockNews);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get IP address from environment variable
  const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;

  // Fetch events from backend
  const fetchEvents = async () => {
    if (!ipAddress) {
      setError('API URL not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://${ipAddress}:5000/api/event/getAllEvents`);
      const backendEvents = response.data.data;

      // Transform backend data to match your Event interface
      const transformedEvents: Event[] = backendEvents.map((event: any) => ({
        id: event._id, // MongoDB uses _id
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        image: event.imageUrl, // Your backend uses imageUrl
        maxParticipants: event.maxParticipants || 100, // Default if not set
        currentParticipants: event.attendees?.length || 0, // Count attendees array
        category: event.category || 'Event', // Default category
        greenPoints: event.greenPoints || 25, // Default points
        isRegistered: event.isRegistered || false,
        isAttended: event.isAttended || false,
      }));

      setEvents(transformedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [ipAddress]);

  const registerForEvent = async (eventId: string, userId: string): Promise<boolean> => {
    if (!ipAddress) {
      setError('API URL not configured');
      return false;
    }

    try {
      const response = await axios.put(`http://${ipAddress}:5000/api/users/registerToEvent/${eventId}`, {
        userId
      });

      // Update local state with the returned event data
      const updatedEvent = response.data.data;
      setEvents(prev => prev.map(event =>
          event.id === eventId
              ? {
                ...event,
                currentParticipants: updatedEvent.attendees?.length || event.currentParticipants + 1,
                isRegistered: true
              }
              : event
      ));

      return true;
    } catch (err: any) {
      console.error('Error registering for event:', err);
      setError(err.response?.data?.message || 'Failed to register for event');
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string, userId: string): Promise<boolean> => {
    if (!ipAddress) {
      setError('API URL not configured');
      return false;
    }

    try {
      const response = await axios.put(`http://${ipAddress}:5000/api/users/unregisterFromEvent/${eventId}`, {
        userId
      });

      // Update local state with the returned event data
      const updatedEvent = response.data.data;
      setEvents(prev => prev.map(event =>
          event.id === eventId
              ? {
                ...event,
                currentParticipants: updatedEvent.attendees?.length || Math.max(0, event.currentParticipants - 1),
                isRegistered: false
              }
              : event
      ));

      return true;
    } catch (err: any) {
      console.error('Error unregistering from event:', err);
      setError(err.response?.data?.message || 'Failed to unregister from event');
      return false;
    }
  };

  const recordAttendance = async (eventId: string, userId: string): Promise<boolean> => {
    if (!ipAddress) {
      setError('API URL not configured');
      return false;
    }

    try {
      // TODO: Create backend endpoint for recording attendance
      // const response = await axios.post(`http://${ipAddress}:5000/api/events/attend`, {
      //   eventId,
      //   userId
      // });

      // For now, update local state (remove this when backend route is ready)
      setEvents(prev => prev.map(event =>
          event.id === eventId
              ? { ...event, isAttended: true }
              : event
      ));

      // Award green points
      const event = events.find(e => e.id === eventId);
      if (event) {
        setLeaderboard(prev => prev.map(user =>
            user.id === userId
                ? { ...user, points: user.points + event.greenPoints }
                : user
        ).sort((a, b) => b.points - a.points));
      }

      return true;
    } catch (err: any) {
      console.error('Error recording attendance:', err);
      setError(err.response?.data?.message || 'Failed to record attendance');
      return false;
    }
  };

  const refreshEvents = async () => {
    await fetchEvents();
  };

  return (
      <DataContext.Provider value={{
        events,
        news,
        leaderboard,
        isLoading,
        error,
        registerForEvent,
        unregisterFromEvent,
        recordAttendance,
        refreshEvents,
      }}>
        {children}
      </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}