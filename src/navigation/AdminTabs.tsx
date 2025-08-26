import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminCollectionsScreen from '../screens/admin/AdminCollectionsScreen';
import AdminWorkersScreen from '../screens/admin/AdminWorkersScreen';
import AdminCustomersScreen from '../screens/admin/AdminCustomersScreen';
import AdminPaymentsScreen from '../screens/admin/AdminPaymentsScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'help';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Collections') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Workers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Customers') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a80f5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Collections" component={AdminCollectionsScreen} />
      <Tab.Screen name="Workers" component={AdminWorkersScreen} />
      <Tab.Screen name="Customers" component={AdminCustomersScreen} />
      <Tab.Screen name="Payments" component={AdminPaymentsScreen} />
      <Tab.Screen name="Reports" component={AdminReportsScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabs;
