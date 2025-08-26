import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import AdminTabs from './AdminTabs';
import { AdminProvider } from '../context/AdminContext';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, userRole } = useUser();

  if (isAuthenticated === null) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <AdminProvider>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#fff' },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : userRole === 'admin' ? (
            <Stack.Screen name="Admin" component={AdminTabs} />
          ) : (
            <Stack.Screen name="Main" component={DashboardScreen} />
          )}
        </Stack.Navigator>
      </AdminProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
