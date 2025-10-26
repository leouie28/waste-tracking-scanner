import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function EntryScreen() {
  const router = useRouter()

  const handleSession = async () => {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      router.replace('/(tabs)/history')
    }
  }

  useEffect(() => {
    handleSession()
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1'>
        <View className='flex-1 p-8 gap-8 justify-between'>
          <View className='aspect-square overflow-hidden rounded-xl'>
            <Image 
              className='object-cover w-full h-full'
              source={require('./../assets/images/image.jpeg')}
            />
          </View>
          <View className='gap-4'>
            {/* <Text className='text-center text-2xl font-medium'>Scanner Portal</Text> */}
            <Pressable 
              className='w-full rounded-xl text-center p-4 bg-gray-200 active:opacity-50'
              onPress={() => {
                router.navigate('/signup')
              }}
            >
              <Text className='text-center'>Signup</Text>
            </Pressable>
            <Pressable 
              className='w-full rounded-xl text-center p-4 active:bg-gray-200'
              onPress={() => {
                router.navigate('/login')
              }}
            >
              <Text className='text-center'>Login</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}