import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { Card, Title, Searchbar, Button, useTheme } from 'react-native-paper';
import { adminWorkers } from '../../services/adminApi';

const AdminWorkersScreen = () => {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const fetchWorkers = async () => {
    try {
      const response = await adminWorkers.getWorkers();
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkers();
  };

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderWorkerItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.workerContainer}>
          <Image 
            source={{ uri: item.profile_image || 'https://via.placeholder.com/50' }} 
            style={styles.avatar} 
          />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName}>{item.name}</Text>
            <Text style={styles.workerEmail}>{item.email}</Text>
            <Text style={styles.workerPhone}>{item.phone || 'No phone number'}</Text>
          </View>
          <View style={styles.workerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.total_collections || 0}</Text>
              <Text style={styles.statLabel}>Collections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>${item.total_amount || 0}</Text>
              <Text style={styles.statLabel}>Collected</Text>
            </View>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button mode="outlined" onPress={() => {}}>
          View Details
        </Button>
        <Button mode="contained" onPress={() => {}}>
          Message
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Workers</Title>
        <Searchbar
          placeholder="Search workers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={filteredWorkers}
        renderItem={renderWorkerItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No workers found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  searchBar: {
    marginTop: 8,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  workerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  workerEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  workerPhone: {
    fontSize: 12,
    color: '#666',
  },
  workerStats: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  list: {
    paddingBottom: 16,
  },
});

export default AdminWorkersScreen;
