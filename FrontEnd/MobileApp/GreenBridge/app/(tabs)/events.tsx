import React, { useState } from 'react';
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
import { MapPin, Clock, Users, Award, Search, Filter } from 'lucide-react-native';

export default function EventsScreen() {
  const { user, updateUser } = useAuth();
  const { events, registerForEvent } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Workshop', 'Community', 'Summit', 'Training'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRegister = (eventId: string) => {
    if (!user) return;

    if (user.registeredEvents.includes(eventId)) {
      Alert.alert('Already Registered', 'You have already registered for this event.');
      return;
    }

    Alert.alert(
      'Confirm Registration',
      'Are you sure you want to register for this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Register',
          onPress: () => {
            registerForEvent(eventId, user.id);
            updateUser({
              registeredEvents: [...user.registeredEvents, eventId]
            });
            Alert.alert('Success', 'You have been registered for this event!');
          }
        }
      ]
    );
  };

  const isRegistered = (eventId: string) => {
    return user?.registeredEvents.includes(eventId) || false;
  };

  const isAttended = (eventId: string) => {
    return user?.attendedEvents.includes(eventId) || false;
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
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

      <ScrollView style={styles.scrollView}>
        {filteredEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            
            {isAttended(event.id) && (
              <View style={styles.attendedBadge}>
                <Award color="white" size={16} />
                <Text style={styles.attendedText}>Attended</Text>
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
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isRegistered(event.id) && styles.registeredButton,
                  isAttended(event.id) && styles.attendedButton
                ]}
                onPress={() => handleRegister(event.id)}
                disabled={isRegistered(event.id) || isAttended(event.id)}
              >
                <Text style={[
                  styles.registerButtonText,
                  isRegistered(event.id) && styles.registeredButtonText,
                  isAttended(event.id) && styles.attendedButtonText
                ]}>
                  {isAttended(event.id) ? 'Attended' : 
                   isRegistered(event.id) ? 'Registered' : 'Register'}
                </Text>
              </TouchableOpacity>
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
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    paddingHorizontal: 24,
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
  registerButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registeredButton: {
    backgroundColor: '#E5E7EB',
  },
  attendedButton: {
    backgroundColor: '#FEF3C7',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  registeredButtonText: {
    color: '#6B7280',
  },
  attendedButtonText: {
    color: '#F59E0B',
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