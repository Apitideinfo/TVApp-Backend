import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

interface CustomersScreenProps {
  navigation: any;
}

const CustomersScreen: React.FC<CustomersScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const customers = [
    { name: 'Sophia Bennett', id: '12345', status: 'Pending', avatar: 'SB' },
    { name: 'Ethan Carter', id: '12346', status: 'Done', avatar: 'EC' },
    { name: 'Olivia Davis', id: '12347', status: 'Pending', avatar: 'OD' },
    { name: 'Noah Evans', id: '12348', status: 'Done', avatar: 'NE' },
    { name: 'Ava Foster', id: '12349', status: 'Pending', avatar: 'AF' },
    { name: 'Liam Gray', id: '12350', status: 'Done', avatar: 'LG' },
    { name: 'Isabella Hayes', id: '12351', status: 'Pending', avatar: 'IH' },
    { name: 'Mason Ingram', id: '12352', status: 'Done', avatar: 'MI' },
    { name: 'Mia Jenkins', id: '12353', status: 'Pending', avatar: 'MJ' },
    { name: 'Lucas King', id: '12354', status: 'Done', avatar: 'LK' },
  ];

  const filters = ['All', 'Active', 'Inactive'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCustomer')}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers"
            placeholderTextColor="#6c757d"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Customers List */}
        <View style={styles.customersList}>
          {customers.map((customer, index) => (
            <View key={index} style={styles.customerItem}>
              <View style={styles.customerInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{customer.avatar}</Text>
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerId}>ID: {customer.id}</Text>
                </View>
              </View>
              <View style={[
                styles.statusButton,
                customer.status === 'Done' ? styles.statusDone : styles.statusPending
              ]}>
                <Text style={[
                  styles.statusText,
                  customer.status === 'Done' ? styles.statusTextDone : styles.statusTextPending
                ]}>
                  {customer.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  customersList: {
    gap: 12,
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  customerId: {
    fontSize: 14,
    color: '#6c757d',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#f8f9fa',
  },
  statusDone: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextPending: {
    color: '#6c757d',
  },
  statusTextDone: {
    color: '#1976d2',
  },
});

export default CustomersScreen; 