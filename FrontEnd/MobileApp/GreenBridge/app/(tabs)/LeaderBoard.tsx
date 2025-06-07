// LeaderboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';

interface User {
  id: string;
  name: string;
  greenPoints: number;
  avatar?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice', greenPoints: 250, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Bob', greenPoints: 180, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Charlie', greenPoints: 320, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'David', greenPoints: 100, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Eva', greenPoints: 270, avatar: 'https://i.pravatar.cc/150?img=5' },
];

export default function LeaderboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const sorted = [...mockUsers].sort((a, b) => b.greenPoints - a.greenPoints);
    setFilteredUsers(sorted);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = mockUsers
      .filter((user) => user.name.toLowerCase().includes(text.toLowerCase()))
      .sort((a, b) => b.greenPoints - a.greenPoints);
    setFilteredUsers(filtered);
  };

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <View style={styles.card}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.points}>{item.greenPoints} points</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🌿 Green Leaderboard</Text>
      <TextInput
        placeholder="Search user..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2f855a',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    width: 40,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  points: {
    fontSize: 14,
    color: '#718096',
  },
});

