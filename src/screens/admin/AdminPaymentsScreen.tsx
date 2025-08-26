import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Card, Title, Searchbar, Button, useTheme, Menu } from 'react-native-paper';
import { adminPayments } from '../../services/adminApi';

const AdminPaymentsScreen = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();

  const fetchPayments = async () => {
    try {
      const response = await adminPayments.getPayments({ status: filterStatus === 'all' ? '' : filterStatus });
      setPayments(response.data.payments || response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const handleVerifyPayment = async (paymentId: number) => {
    try {
      await adminPayments.verifyPayment(paymentId, { status: 'verified' });
      // Refresh payments after verification
      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const name = (payment.customer_name || '').toString().toLowerCase();
    const amountStr = (payment.amount || '').toString();
    return name.includes(searchQuery.toLowerCase()) || amountStr.includes(searchQuery);
  });

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

  const renderPaymentItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.paymentHeader}>
          <Text style={styles.amount}>${item.amount}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{item.customer_name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {new Date(item.collection_date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{item.payment_method || 'N/A'}</Text>
          </View>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </Card.Content>
      
      {item.status === 'pending' && (
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="outlined" 
            onPress={() => handleVerifyPayment(item.id)}
            style={styles.actionButton}
          >
            Verify
          </Button>
          <Button 
            mode="contained" 
            onPress={() => {}}
            style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          >
            Reject
          </Button>
        </Card.Actions>
      )}
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
        <Title>Payments</Title>
        <View style={styles.filterContainer}>
          <Searchbar
            placeholder="Search payments..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { flex: 1 }]}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setMenuVisible(true)}
                style={styles.filterButton}
                icon="filter"
              >
                {filterStatus === 'all' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </Button>
            }
          >
            <Menu.Item 
              onPress={() => {
                setFilterStatus('all');
                setMenuVisible(false);
              }} 
              title="All" 
            />
            <Menu.Item 
              onPress={() => {
                setFilterStatus('pending');
                setMenuVisible(false);
              }} 
              title="Pending" 
            />
            <Menu.Item 
              onPress={() => {
                setFilterStatus('verified');
                setMenuVisible(false);
              }} 
              title="Verified" 
            />
            <Menu.Item 
              onPress={() => {
                setFilterStatus('rejected');
                setMenuVisible(false);
              }} 
              title="Rejected" 
            />
          </Menu>
        </View>
      </View>
      
      <FlatList
        data={filteredPayments}
        renderItem={renderPaymentItem}
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
            <Text>No payments found</Text>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    marginLeft: 8,
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
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  notesLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  list: {
    paddingBottom: 16,
  },
});

export default AdminPaymentsScreen;
