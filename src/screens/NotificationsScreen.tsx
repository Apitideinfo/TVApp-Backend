import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

interface NotificationsScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const notifications = [
    { id: 1, dueDays: 1 },
    { id: 2, dueDays: 2 },
    { id: 3, dueDays: 3 },
    { id: 4, dueDays: 4 },
  ];

  const handleRechargeNow = (id: number) => {
    // Handle recharge action
    console.log('Recharge now for notification:', id);
  };

  const handleClearAll = () => {
    // Handle clear all notifications
    console.log('Clear all notifications');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications List */}
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              {/* Left Side - Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.clockIcon}>🕐</Text>
              </View>

              {/* Middle Section - Text Details */}
              <View style={styles.notificationDetails}>
                <Text style={styles.notificationTitle}>Pending Recharge</Text>
                <Text style={styles.dueDate}>
                  Due in {notification.dueDays} day{notification.dueDays > 1 ? 's' : ''}
                </Text>
                <Text style={styles.notificationDescription}>
                  Recharge your account to avoid service interruption.
                </Text>
              </View>

              {/* Right Side - Action Button */}
              <TouchableOpacity
                style={styles.rechargeButton}
                onPress={() => handleRechargeNow(notification.id)}
              >
                <Text style={styles.rechargeButtonText}>Recharge Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer - Clear All Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
          <Text style={styles.clearAllButtonText}>Clear All</Text>
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
    color: '#000000',
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationsList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clockIcon: {
    fontSize: 16,
  },
  notificationDetails: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#000000',
  },
  rechargeButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  rechargeButtonText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  clearAllButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  clearAllButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});

export default NotificationsScreen; 