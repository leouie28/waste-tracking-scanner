import api from '@/lib/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabProfileScreen() {
  const router = useRouter()
  
  const { data, error, isFetching, refetch } = useQuery<any, any>({
    queryKey: ['profile'],
    queryFn: async () => (await api.get('/auth')).data,
  })

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    setTimeout(() => {
      router.replace('/')
    }, 500)
  }

  useEffect(() => {
    if (isFetching) return
    if (error) {
      if (error?.response?.status==401) {
        logout()
      }
    }
  }, [error])

  return (
    <SafeAreaView className='flex-1 p-6 gap-4 justify-between' edges={[]}>
      <ScrollView 
        contentContainerClassName='gap-5'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View className='bg-white rounded-lg p-6 gap-6'>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>First Name</Text>
            <Text>{data?.firstname}</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Last Name</Text>
            <Text>{data?.lastname}</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Gender</Text>
            <Text>{data?.gender}</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Birthdate</Text>
            <Text>{data?.birthdate ? new Date(data?.birthdate).toDateString() : ''}</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Barangay</Text>
            <Text>{data?.barangay}</Text>
          </View>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Purok</Text>
            <Text>{data?.purok}</Text>
          </View>
          <View className='flex-row justify-end'>
            <TouchableOpacity>
              <Text className='text-blue-400 text-lg'>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          className='p-4 bg-white rounded-lg gap-2 flex-row items-center justify-center'
          onPress={logout}
        >
          <Text className='text-red-600'>Logout</Text>
          <MaterialIcons name="logout" size={16} color="red" />
        </TouchableOpacity>
      </ScrollView>
      <View className='rounded-lg p-4 gap-4'>
        <View className='flex-row gap-2'>
          <Text className='text-gray-600'>App version</Text>
          <Text>v0.0.2</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}