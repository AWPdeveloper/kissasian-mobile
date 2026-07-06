import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import DramaDetailScreen from './screens/DramaDetailScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#FF6B6B',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DramaDetail"
        component={DramaDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.drama?.title || 'Detail Drama',
        })}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#FF6B6B',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#fff',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="SearchMain"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DramaDetail"
        component={DramaDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.drama?.title || 'Detail Drama',
        })}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#666',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Beranda',
            tabBarLabel: 'Beranda',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            title: 'Cari',
            tabBarLabel: 'Cari',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔍</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#2a2a2a',
    borderTopWidth: 1,
  },
});

import { Text } from 'react-native';
