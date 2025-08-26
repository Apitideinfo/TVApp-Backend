import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

interface OverviewScreenProps {
  navigation: any;
}

const OverviewScreen: React.FC<OverviewScreenProps> = ({ navigation }) => {
  const metrics = [
    { title: 'Total Customers', value: '1,234', change: '+10%', isPositive: true },
    { title: 'Active Customers', value: '1,100', change: '+5%', isPositive: true },
    { title: 'Monthly Revenue', value: '$5,000', change: '+2%', isPositive: true },
    { title: 'Pending Payments', value: '10', change: '-1%', isPositive: false },
    { title: 'Daily Recovery', value: '2', change: '+1%', isPositive: true },
  ];

  const upcomingRecharges = [
    { name: 'Sophia Clark', days: 2, avatar: 'SC' },
    { name: 'Ethan Carter', days: 3, avatar: 'EC' },
    { name: 'Olivia Bennett', days: 4, avatar: 'OB' },
    { name: 'Noah Parker', days: 5, avatar: 'NP' },
    { name: 'Ava Mitchell', days: 6, avatar: 'AM' },
    { name: 'Liam Foster', days: 7, avatar: 'LF' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Overview</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics Cards */}
        <View style={styles.metricsContainer}>
          {metrics.map((metric, index) => {
            const changeColor = metric.isPositive ? '#28a745' : '#dc3545';
            return (
              <View key={index} style={styles.metricCard}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={[styles.metricChange, { color: changeColor }]}>
                  {metric.change}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Upcoming Recharges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Recharges</Text>
          <View style={styles.rechargesList}>
            {upcomingRecharges.map((recharge, index) => (
              <View key={index} style={styles.rechargeItem}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{recharge.avatar}</Text>
                </View>
                <View style={styles.rechargeInfo}>
                  <Text style={styles.rechargeName}>{recharge.name}</Text>
                  <Text style={styles.rechargeDue}>Due in {recharge.days} days</Text>
                </View>
              </View>
            ))}
          </View>
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  rechargesList: {
    gap: 12,
  },
  rechargeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  rechargeInfo: {
    flex: 1,
  },
  rechargeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  rechargeDue: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default OverviewScreen; 