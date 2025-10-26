import api from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function LoginScreen() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [fieldErr, setFieldErr] = useState('')

  const { isPending, mutate } = useMutation({
    mutationFn: async () => (await api.post('/auth', form)).data,
    onSuccess: async (data) => {
      const fullname = data?.user?.firstname + ' ' + data?.user?.lastname
      await AsyncStorage.setItem('fullname', fullname)
      if(data?.token) {
        await AsyncStorage.setItem('token', data?.token)
        setTimeout(() => {
          router.replace('/(tabs)/history')
        }, 500)
      }
    },
    onError: (error: any) => setFieldErr(error?.response?.data?.message||"Login failed")
  })

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 p-10 gap-4 pt-20'>
        <View className='items-center mb-2'>
          <Text className='text-2xl font-semibold'>Login</Text>
          <Text className='text-sm'>Welcome back!</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='gap-4'
        >
          <TextInput 
            placeholder='user@example.com'
            className='border border-gray-300 p-3 rounded-lg focus:border-green-600'
            autoCapitalize='none'
            autoComplete='email'
            keyboardType='email-address'
            value={form.email}
            onChangeText={(val) => setForm((p) => ({ ...p, email: val }))}
          />
          <TextInput 
            placeholder='password'
            className='border border-gray-300 p-3 rounded-lg'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            value={form.password}
            onChangeText={(val) => setForm((p) => ({ ...p, password: val }))}
          />
          {fieldErr && <Text className='text-red-500'>{fieldErr}</Text>}
          <Pressable 
            className='w-full rounded-lg text-center p-3 bg-green-600 active:opacity-50'
            onPress={() => {
              setFieldErr('')
              if (!form.email || !form.password) {
                setFieldErr('Please fillup all fields')
                return
              }
              mutate()
            }}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className='text-center text-white'>Continue</Text>
            )}
          </Pressable>
          <Pressable 
            className='w-full rounded-lg text-center p-3 active:opacity-50'
            onPress={() => router.replace('/signup')}
          >
            <Text className='text-center text-green-600'>Don't have an account?</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}