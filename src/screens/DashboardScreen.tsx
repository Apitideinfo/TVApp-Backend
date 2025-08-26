import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import { images } from '../assets';

// Import screens
import OverviewScreen from './OverviewScreen';
import CustomersScreen from './CustomersScreen';
import PendingPaymentsScreen from './PendingPaymentsScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const DashboardScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
          let iconSource;
          let label;

          if (route.name === 'Home') {
            iconSource = images.home;
          } else if (route.name === 'Customers') {
            iconSource = images.customer;
            
          } else if (route.name === 'Payments') {
            iconSource = images.payment;
            
          } else if (route.name === 'Settings') {
            iconSource = images.settings;
            
          }

          const iconColor = focused ? '#007bff' : '#6c757d';
          return (
            <View style={styles.tabItem}>
              <Image 
                source={iconSource} 
                style={[
                  styles.tabIcon, 
                  { 
                    tintColor: iconColor,
                    width: 24,
                    height: 24,
                    resizeMode: 'contain'
                  }
                ]} 
              />
              <Text style={[styles.tabLabel, { color: iconColor }]}>
                {label}
              </Text>
            </View>
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#6c757d',
        headerShown: false,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Home" component={OverviewScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Payments" component={PendingPaymentsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingBottom: 0,
    paddingTop: 13,
    height: 80,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default DashboardScreen; 