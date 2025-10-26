import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const username = useMemo(async () => {
    const name = await AsyncStorage.getItem('fullname')
    return name || "User"
  }, [])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        // headerShown: false,
        tabBarShowLabel: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: (props) => (
            <View>
              <Text className='text-2xl font-semibold'>Scanner</Text>
              <Text className='text-sm text-gray-500'>{username}</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <AntDesign name="scan" className='-mb-2' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerTitle: (props) => (
            <View>
              <Text className='text-2xl font-semibold'>History</Text>
              <Text className='text-sm text-gray-500'>{username}</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <AntDesign name="history" className='-mb-2' size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: (props) => (
            <View>
              <Text className='text-2xl font-semibold'>Profile</Text>
              <Text className='text-sm text-gray-500'>{username}</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" className='-mb-2' size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
