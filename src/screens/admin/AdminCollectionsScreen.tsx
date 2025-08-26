import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Title, Searchbar, Button, useTheme } from 'react-native-paper';
import { adminCollections } from '../../services/adminApi';

const AdminCollectionsScreen = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const fetchCollections = async () => {
    try {
      const response = await adminCollections.getCollections({ search: searchQuery });
      const data = response.data.collections || response.data;
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCollections();
  };

  const renderCollectionItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.amount}>${item.amount}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Worker</Text>
            <Text>{item.worker_name}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Date</Text>
            <Text>{new Date(item.collection_date).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </Card.Content>
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
        <Title>Collections</Title>
        <Searchbar
          placeholder="Search collections..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={collections}
        renderItem={renderCollectionItem}
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
            <Text>No collections found</Text>
          </View>
        }
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'verified':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'rejected':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
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
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 16,
  },
});

export default AdminCollectionsScreen;
