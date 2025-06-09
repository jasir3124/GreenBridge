import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { MapPin, Clock, Users, Award, Search, CheckCircle, Calendar, Star } from 'lucide-react-native';

export default function EventsScreen() {
  const { user, updateUser } = useAuth();
  const { events, registerForEvent, recordAttendance, refreshEvents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loadingStates, setLoadingStates] = useState({}); // Changed to object to track individual events
  const ipAddress = process.env.EXPO_PUBLIC_IP_ADDRESS;

  useFocusEffect(
      useCallback(() => {
        refreshEvents();
      }, [])
  );

  const categories = ['All', 'Workshop', 'Community', 'Summit', 'Training'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventFull = (event) => {
    return event.currentParticipants >= event.maxParticipants;
  };

  const isEventPast = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const isEventHappening = (eventDate) => {
    const eventTime = new Date(eventDate);
    const now = new Date();
    const timeDiff = eventTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff >= -4 && hoursDiff <= 2;
  };

  const isRegistered = (eventId) => {
    return user?.registeredEvents.includes(eventId) || false;
  };

  const isAttended = (eventId) => {
    return user?.attendedEvents.includes(eventId) || false;
  };

  const getEventStatus = (event) => {
    if (isAttended(event.id)) return 'attended';
    if (isRegistered(event.id)) {
      if (isEventHappening(event.date)) return 'canAttend';
      if (isEventPast(event.date)) return 'missed';
      return 'registered';
    }
    if (isEventPast(event.date)) return 'past';
    if (isEventFull(event)) return 'full';
    return 'available';
  };

  // Helper function to set loading state for specific event
  const setEventLoading = (eventId, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [eventId]: isLoading
    }));
  };

  // Helper function to get loading state for specific event
  const getEventLoading = (eventId) => {
    return loadingStates[eventId] || false;
  };

  const handleRegister = async (eventId) => {
    if (!user || getEventLoading(eventId)) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (isEventFull(event)) {
      Alert.alert('Event Full', 'This event has reached maximum capacity.');
      return;
    }

    if (isEventPast(event.date)) {
      Alert.alert('Event Ended', 'Registration is no longer available for this event.');
      return;
    }

    if (user.registeredEvents.includes(eventId)) {
      Alert.alert('Already Registered', 'You have already registered for this event.');
      return;
    }

    Alert.alert(
        'Confirm Registration',
        `Register for "${event.title}"?\n\nDate: ${formatDate(event.date)}\nLocation: ${event.location}\n\nYou'll earn +${event.greenPoints} green points upon attendance.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Register',
            onPress: async () => {
              setEventLoading(eventId, true);
              try {
                console.log('Starting registration for event:', eventId);

                const response = await fetch(`https://${ipAddress}/api/users/registerToEvent/${eventId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userId: user.id }),
                });

                console.log('Registration response status:', response.status);

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Registration failed:', response.status, errorText);
                  throw new Error(`Registration failed: ${response.status}`);
                }

                const responseData = await response.json();
                console.log('Registration successful:', responseData);

                // Update local state after successful registration
                await registerForEvent(eventId, user.id);
                updateUser({
                  registeredEvents: [...user.registeredEvents, eventId]
                });

                Alert.alert(
                    'Registration Successful!',
                    `You're registered for "${event.title}". We'll remind you before the event starts.`
                );
              } catch (error) {
                console.error('Registration error:', error);
                Alert.alert(
                    'Registration Failed',
                    'Please check your internet connection and try again. If the problem persists, please contact support.'
                );
              } finally {
                setEventLoading(eventId, false);
              }
            }
          }
        ]
    );
  };

  const handleCancelRegistration = async (eventId) => {
    if (!user || getEventLoading(eventId)) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    Alert.alert(
        'Cancel Registration',
        `Are you sure you want to cancel your registration for "${event.title}"?`,
        [
          { text: 'Keep Registration', style: 'cancel' },
          {
            text: 'Cancel Registration',
            style: 'destructive',
            onPress: async () => {
              setEventLoading(eventId, true);
              try {
                console.log('Starting cancellation for event:', eventId);

                const response = await fetch(`https://${ipAddress}/api/users/unregisterFromEvent/${eventId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userId: user.id }),
                });

                console.log('Cancellation response status:', response.status);

                if (!response.ok) {
                  const errorText = await response.text();
                  console.error('Cancellation failed:', response.status, errorText);
                  throw new Error(`Cancellation failed: ${response.status}`);
                }

                const responseData = await response.json();
                console.log('Cancellation successful:', responseData);

                // Update local state after successful unregister
                updateUser({
                  registeredEvents: user.registeredEvents.filter(id => id !== eventId)
                });

                Alert.alert('Registration Cancelled', 'Your registration has been cancelled.');
              } catch (error) {
                console.error('Cancellation error:', error);
                Alert.alert(
                    'Cancellation Failed',
                    'Please check your internet connection and try again. If the problem persists, please contact support.'
                );
              } finally {
                setEventLoading(eventId, false);
              }
            }
          }
        ]
    );
  };

  const handleAttendance = async (eventId) => {
    if (!user || getEventLoading(eventId)) return;

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (!isRegistered(eventId)) {
      Alert.alert('Not Registered', 'You must register for this event first.');
      return;
    }

    if (isAttended(eventId)) {
      Alert.alert('Already Attended', 'You have already marked attendance for this event.');
      return;
    }

    if (!isEventHappening(event.date)) {
      Alert.alert(
          'Check-in Not Available',
          'Event check-in is only available 2 hours before and up to 4 hours after the event start time.'
      );
      return;
    }

    const eventDetails = `📅 Event: ${event.title}
📅 ${formatDate(event.date)}
📍 Location: ${event.location}
🏷️ Category: ${event.category}
👥 Participants: ${event.currentParticipants}/${event.maxParticipants}
🌟 Points: +${event.greenPoints} green points
💚 Current Points: ${user.greenPoints}
💚 New Total: ${user.greenPoints + event.greenPoints}

📝 Description: ${event.description}

🎉 Confirming attendance will award you ${event.greenPoints} green points and cannot be undone.`;

    Alert.alert(
        '✅ Confirm Event Attendance',
        eventDetails,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Mark as Attended',
            style: 'default',
            onPress: async () => {
              setEventLoading(eventId, true);
              try {
                await recordAttendance(eventId, user.id);

                const newPoints = user.greenPoints + event.greenPoints;
                const newLevel = Math.floor(newPoints / 100) + 1;
                const currentLevel = Math.floor(user.greenPoints / 100) + 1;
                const leveledUp = newLevel > currentLevel;

                updateUser({
                  attendedEvents: [...user.attendedEvents, eventId],
                  registeredEvents: user.registeredEvents.filter(id => id !== eventId),
                  greenPoints: newPoints
                });

                if (leveledUp) {
                  Alert.alert(
                      '🎉 Level Up Achievement!',
                      `🌟 Congratulations! You've reached Level ${newLevel}!\n\n✅ Event: ${event.title}\n🏆 Points Earned: +${event.greenPoints}\n💚 Total Points: ${newPoints}\n🚀 New Level: ${newLevel}\n\nKeep up the great work making a difference!`
                  );
                } else {
                  Alert.alert(
                      '✅ Attendance Successfully Recorded!',
                      `🎉 Thank you for attending "${event.title}"!\n\n🏆 Points Earned: +${event.greenPoints}\n💚 Total Points: ${newPoints}\n📈 Level: ${currentLevel}\n\nYour participation makes a real impact!`
                  );
                }
              } catch (error) {
                console.error('Attendance error:', error);
                Alert.alert('❌ Attendance Error', 'Failed to record your attendance. Please try again or contact support if the issue persists.');
              } finally {
                setEventLoading(eventId, false);
              }
            }
          }
        ]
    );
  };

  const renderEventButton = (event) => {
    const status = getEventStatus(event);
    const isLoading = getEventLoading(event.id);

    switch (status) {
      case 'attended':
        return (
            <View style={styles.attendedButton}>
              <Award color="#F59E0B" size={16} />
              <Text style={styles.attendedButtonText}>Attended (+{event.greenPoints} pts)</Text>
            </View>
        );

      case 'canAttend':
        return (
            <TouchableOpacity
                style={[styles.attendButton, isLoading && styles.disabledButton]}
                onPress={() => handleAttendance(event.id)}
                disabled={isLoading}
            >
              <CheckCircle color="white" size={16} />
              <Text style={styles.attendButtonText}>
                {isLoading ? 'Processing...' : 'Mark Attendance'}
              </Text>
            </TouchableOpacity>
        );

      case 'registered':
        return (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                  style={[styles.cancelButton, isLoading && styles.disabledButton]}
                  onPress={() => handleCancelRegistration(event.id)}
                  disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>
                  {isLoading ? 'Cancelling...' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <View style={styles.registeredButton}>
                <Calendar color="#16A34A" size={16} />
                <Text style={styles.registeredButtonText}>Registered</Text>
              </View>
            </View>
        );

      case 'missed':
        return (
            <View style={styles.missedButton}>
              <Text style={styles.missedButtonText}>Event Missed</Text>
            </View>
        );

      case 'past':
        return (
            <View style={styles.pastButton}>
              <Text style={styles.pastButtonText}>Event Ended</Text>
            </View>
        );

      case 'full':
        return (
            <View style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Event Full</Text>
            </View>
        );

      default:
        return (
            <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.disabledButton]}
                onPress={() => handleRegister(event.id)}
                disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>
        );
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events</Text>
          <Text style={styles.headerSubtitle}>Discover and join green initiatives</Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#6B7280" size={20} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
            {categories.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      filterCategory === category && styles.filterChipActive
                    ]}
                    onPress={() => setFilterCategory(category)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterCategory === category && styles.filterChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          {filteredEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />

                {isAttended(event.id) && (
                    <View style={styles.attendedBadge}>
                      <Award color="white" size={16} />
                      <Text style={styles.attendedText}>Attended</Text>
                    </View>
                )}

                {isEventHappening(event.date) && isRegistered(event.id) && !isAttended(event.id) && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>CHECK-IN AVAILABLE</Text>
                    </View>
                )}

                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventCategory}>{event.category}</Text>
                    <Text style={styles.eventPoints}>+{event.greenPoints} pts</Text>
                  </View>

                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>

                  <View style={styles.eventMeta}>
                    <View style={styles.metaItem}>
                      <Clock color="#6B7280" size={16} />
                      <Text style={styles.metaText}>{formatDate(event.date)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MapPin color="#6B7280" size={16} />
                      <Text style={styles.metaText}>{event.location}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users color="#6B7280" size={16} />
                      <Text style={styles.metaText}>
                        {event.currentParticipants}/{event.maxParticipants}
                        {isEventFull(event) && <Text style={styles.fullText}> (Full)</Text>}
                      </Text>
                    </View>
                  </View>

                  {renderEventButton(event)}
                </View>
              </View>
          ))}

          {filteredEvents.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No events found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your search or filter criteria
                </Text>
              </View>
          )}
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScrollContent: {
    paddingHorizontal: 24,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  attendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendedText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventCategory: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventPoints: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  eventMeta: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  fullText: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  registerButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  attendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  attendButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  registeredButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  registeredButtonText: {
    color: '#16A34A',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  cancelButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  attendedButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  attendedButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  missedButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  missedButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  pastButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pastButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  fullButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  fullButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
