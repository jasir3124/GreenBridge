import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import {
  User,
  Award,
  Calendar,
  Camera,
  Settings,
  LogOut,
  Trophy,
  Leaf,
  Upload,
  Share2
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { events, leaderboard } = useData();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEventForQR, setSelectedEventForQR] = useState<string | null>(null);

  if (!user) return null;

  const registeredEvents = events.filter(event =>
    user.registeredEvents.includes(event.id)
  );

  const attendedEvents = events.filter(event =>
    user.attendedEvents.includes(event.id)
  );

  const userRank = leaderboard.findIndex(u => u.id === user.id) + 1;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Photo upload functionality would be implemented here with image picker.',
      [{ text: 'OK' }]
    );
  };

  const handleShareProfile = () => {
    Alert.alert(
      'Share Profile',
      'Share your GreenBridge achievements with friends!',
      [{ text: 'OK' }]
    );
  };

  const generateQRCode = (eventId: string) => {
    return JSON.stringify({
      eventId,
      userId: user.id,
      timestamp: new Date().toISOString()
    });
  };

  const showEventQR = (eventId: string) => {
    setSelectedEventForQR(eventId);
    setShowQRModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#22C55E', '#16A34A']}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User color="white" size={32} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <Camera color="white" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareProfile}>
              <Share2 color="white" size={16} />
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Leaf color="#22C55E" size={24} />
            <Text style={styles.statNumber}>{user.greenPoints}</Text>
            <Text style={styles.statLabel}>GreenPoints</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy color="#F59E0B" size={24} />
            <Text style={styles.statNumber}>#{userRank || 'N/A'}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
          <View style={styles.statCard}>
            <Award color="#EF4444" size={24} />
            <Text style={styles.statNumber}>{attendedEvents.length}</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
        </View>

        {/* Achievement Badge */}
        {attendedEvents.length >= 3 && (
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Trophy color="#F59E0B" size={24} />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Eco Champion!</Text>
              <Text style={styles.achievementDescription}>
                You've attended {attendedEvents.length} events. Keep up the great work!
              </Text>
            </View>
          </View>
        )}

        {/* Registered Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registered Events</Text>
          {registeredEvents.length > 0 ? (
            registeredEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  <Text style={styles.eventLocation}>{event.location}</Text>
                  <TouchableOpacity
                    style={styles.qrButton}
                    onPress={() => showEventQR(event.id)}
                  >
                    <Text style={styles.qrButtonText}>Show QR Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar color="#9CA3AF" size={48} />
              <Text style={styles.emptyStateText}>No registered events</Text>
              <Text style={styles.emptyStateSubtext}>
                Browse events to start your green journey!
              </Text>
            </View>
          )}
        </View>

        {/* Attended Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attended Events</Text>
          {attendedEvents.length > 0 ? (
            attendedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString()}
                  </Text>
                  <View style={styles.attendedBadge}>
                    <Award color="#22C55E" size={16} />
                    <Text style={styles.attendedText}>+{event.greenPoints} points earned</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Award color="#9CA3AF" size={48} />
              <Text style={styles.emptyStateText}>No attended events yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Attend events to earn GreenPoints and climb the leaderboard!
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleUploadPhoto}>
            <Upload color="#16A34A" size={20} />
            <Text style={styles.actionButtonText}>Upload Event Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Settings color="#6B7280" size={20} />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <LogOut color="#EF4444" size={20} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Event Check-in QR Code</Text>
            {selectedEventForQR && (
              <>
                <Text style={styles.modalSubtitle}>
                  {events.find(e => e.id === selectedEventForQR)?.title}
                </Text>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={generateQRCode(selectedEventForQR)}
                    size={200}
                    backgroundColor="white"
                    color="black"
                  />
                </View>
                <Text style={styles.qrInstructions}>
                  Show this QR code to the event organizer for check-in and to earn your GreenPoints!
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  achievementCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#92400E',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  eventImage: {
    width: 80,
    height: 80,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  qrButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  qrButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  attendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  attendedText: {
    color: '#22C55E',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    alignItems: 'center',
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  qrInstructions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
