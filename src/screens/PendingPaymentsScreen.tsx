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

interface PendingPaymentsScreenProps {
  navigation: any;
}

const PendingPaymentsScreen: React.FC<PendingPaymentsScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const pendingPayments = [
    { customer: 'Alex Bennett', dueDate: '07/15/2024', amount: '$150', avatar: 'AB' },
    { customer: 'Sophia Clark', dueDate: '07/20/2024', amount: '$200', avatar: 'SC' },
    { customer: 'Ethan Davis', dueDate: '07/25/2024', amount: '$100', avatar: 'ED' },
    { customer: 'Olivia Foster', dueDate: '07/30/2024', amount: '$250', avatar: 'OF' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Payments</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#6c757d"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Dropdowns */}
        <View style={styles.filterContainer}>
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>Due Date</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>All</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>Amount</Text>
            <TouchableOpacity style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>All</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Payments List */}
        <View style={styles.paymentsList}>
          {pendingPayments.map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{payment.avatar}</Text>
                </View>
                <View style={styles.paymentDetails}>
                  <Text style={styles.customerLabel}>Customer: {payment.customer}</Text>
                  <Text style={styles.dueLabel}>Due: {payment.dueDate}</Text>
                </View>
              </View>
              <Text style={styles.amountText}>{payment.amount}</Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#212529',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  placeholder: {
    width: 40,
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
  filterDropdown: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  dropdownText: {
    fontSize: 16,
    color: '#212529',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6c757d',
  },
  paymentsList: {
    gap: 12,
  },
  paymentItem: {
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
  paymentInfo: {
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
  paymentDetails: {
    flex: 1,
  },
  customerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  dueLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
});

export default PendingPaymentsScreen; 