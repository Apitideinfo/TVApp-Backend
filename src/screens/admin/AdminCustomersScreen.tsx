import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Title, Searchbar, Button, useTheme, Avatar } from 'react-native-paper';
import { adminCustomers } from '../../services/adminApi';

const AdminCustomersScreen = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const fetchCustomers = async () => {
    try {
      const response = await adminCustomers.getCustomers({});
      const data = response.data.customers || response.data;
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(customer => {
    const name = (customer.name || '').toString().toLowerCase();
    const phone = (customer.phone || '').toString();
    return name.includes(searchQuery.toLowerCase()) || phone.includes(searchQuery);
  });

  const renderCustomerItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.customerContainer}>
          <Avatar.Text 
            size={50} 
            label={item.name.split(' ').map(n => n[0]).join('').toUpperCase()} 
            style={styles.avatar}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.name}</Text>
            <Text style={styles.customerPhone}>{item.email}</Text>
            <Text style={styles.customerAddress} numberOfLines={1}>
              Last payment: {item.last_payment_date ? new Date(item.last_payment_date).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.customerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${item.total_paid || 0}</Text>
              <Text style={styles.statLabel}>Total Paid</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#4a80f5' }]}>
              <Text style={styles.statusText}>{item.total_collections || 0} collections</Text>
            </View>
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
        <Title>Customers</Title>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
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
            <Text>No customers found</Text>
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
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  customerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#4a80f5',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 12,
    color: '#666',
    width: 180,
  },
  customerStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    alignItems: 'flex-end',
    marginBottom: 8,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
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

export default AdminCustomersScreen;
