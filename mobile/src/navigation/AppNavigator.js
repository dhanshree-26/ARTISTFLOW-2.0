import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import EventSlotsScreen from '../screens/EventSlotsScreen';
import InquiriesScreen from '../screens/InquiriesScreen';
import NewInquiryScreen from '../screens/NewInquiryScreen';
import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthLoadingScreen = () => (
  <View style={authLoadingStyles.container}>
    <ActivityIndicator size="large" color="#7c3aed" />
  </View>
);

const authLoadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});

const EventsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="EventsList" component={EventsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EventSlots" component={EventSlotsScreen} options={{ title: 'Event Details' }} />
  </Stack.Navigator>
);

const InquiriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="InquiriesList" component={InquiriesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="NewInquiry" component={NewInquiryScreen} options={{ title: 'New Inquiry' }} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#7c3aed',
      tabBarInactiveTintColor: '#6b7280',
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Events"
      component={EventsStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="calendar" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Inquiries"
      component={InquiriesStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="message-circle" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return <MainTabs />;
};

// Simple icon component (replace with react-native-vector-icons in production)
const Icon = ({ name, size, color }) => {
  // Placeholder - use react-native-vector-icons or expo-icons in production
  // For now, return a simple view
  return <View style={{ width: size, height: size, backgroundColor: color, opacity: 0.3, borderRadius: size / 2 }} />;
};

export default AppNavigator;

