import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';

interface ManualRechargeScreenProps {
  navigation: any;
}

const ManualRechargeScreen: React.FC<ManualRechargeScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleRecharge = () => {
    if (!userId || !rechargeAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert('Success', 'Recharge request submitted successfully!');
  };

  const handleUpdateStatus = () => {
    Alert.alert('Success', 'Status updated to Done!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Recharge</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Input Fields */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter User ID"
            placeholderTextColor="#6c757d"
            value={userId}
            onChangeText={setUserId}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter Recharge Amount"
            placeholderTextColor="#6c757d"
            value={rechargeAmount}
            onChangeText={setRechargeAmount}
            keyboardType="numeric"
          />
          
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.dropdownInput}
              placeholder="Select option"
              placeholderTextColor="#6c757d"
              value={selectedOption}
              onChangeText={setSelectedOption}
              editable={false}
            />
            <View style={styles.dropdownArrows}>
              <Text style={styles.arrowIcon}>▲</Text>
              <Text style={styles.arrowIcon}>▼</Text>
            </View>
          </View>
        </View>

        {/* Recharge Button */}
        <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
          <Text style={styles.rechargeButtonText}>Recharge</Text>
        </TouchableOpacity>

        {/* Recharge Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>Recharge Status</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <Text style={styles.statusLabel}>Recharge Amount: $50</Text>
              <Text style={styles.statusSubLabel}>User ID: 12345</Text>
            </View>
            <View style={styles.statusRight}>
              <Text style={styles.statusBadge}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Update Status Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStatus}>
          <Text style={styles.updateButtonText}>Update Status to Done</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ClientHome')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>📋</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Transactions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#212529',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 16,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
    paddingRight: 50,
  },
  dropdownArrows: {
    position: 'absolute',
    right: 16,
    top: 15,
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 12,
  },
  rechargeButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  rechargeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusSection: {
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLeft: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  statusSubLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  statusRight: {
    marginLeft: 16,
  },
  statusBadge: {
    backgroundColor: '#ffc107',
    color: '#212529',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#6c757d',
  },
  activeNavIcon: {
    color: '#007bff',
  },
  navText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#007bff',
  },
});

export default ManualRechargeScreen; 