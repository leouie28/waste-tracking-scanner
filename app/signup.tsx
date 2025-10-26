import BarangaySelect from '@/components/BarangaySelect'
import CustomSelect from '@/components/CustomSelect'
import api from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
export default function SignupScreen() {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    barangay: '',
    purok: '',
    gender: '',
    birthdate: new Date(),
    email: '',
    password: '',
    code: ''
  })
  const [showPicker, setShowPicker] = useState(false)
  const [fieldErr, setFieldErr] = useState('')
  const [verifyErr, setVerifyErr] = useState('')

  const { data: barangays, isPending: brgLoading } = useQuery({
    queryKey: ['barangays'],
    queryFn: async () => (await api.get('/barangay')).data
  })

  const { isPending, mutate: reqCode } = useMutation({
    mutationFn: async () => (await api.get('/auth/verify', { params: { email: form.email } })).data,
    onSuccess: (data) => {
      console.log(data)
      setModal(true)
    },
    onError: (err: any) => {
      setFieldErr(err?.response?.data?.message||"Unexpected error")
    }
  })

  const { isPending: verifyLoading, mutate: verifyCode } = useMutation({
    mutationFn: async () => (await api.post('/auth/verify', form)).data,
    onSuccess: async (data) => {
      console.log(data)
      if (data?.token) {
        await AsyncStorage.setItem('token', data?.token)
        setTimeout(() => {
          router.replace('/(tabs)/history')
        }, 500)
      }
    },
    onError: (err: any) => {
      setVerifyErr(err?.response?.data?.message||"Unexpected error")
    }
  })

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 p-10 gap-4 pt-20'>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <View className='flex-1 items-center justify-center bg-gray-600/40'>
            <View
              className='w-9/12 bg-gray-100 elevation-md p-8 rounded-lg gap-4'
            >
              <View className='items-center'>
                <Text className='text-xl font-semibold'>Check your email</Text>
                <Text className='text-center text-gray-600'>We sent verification code to your email. Please check on spam folder, some mail platform might categorized by mistaken.</Text>
              </View>
              <TextInput 
                placeholder='enter verification code'
                className='border border-gray-300 p-3 rounded-lg focus:border-green-600'
                autoCapitalize='none'
                value={form.code}
                onChangeText={(val) => setForm((p) => ({ ...p, code: val }))}
              />
              {verifyErr && (
                <Text className='text-red-500'>{verifyErr}</Text>
              )}
              <Pressable 
                className='w-full rounded-lg text-center p-3 bg-green-600 active:opacity-50'
                onPress={() => {
                  setVerifyErr('')
                  verifyCode()
                }}
              >
                {verifyLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className='text-center text-white'>Verify</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>
        <View className='items-center mb-2'>
          <Text className='text-2xl font-semibold'>Create your account</Text>
          <Text className='text-sm'>Welcome!</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='gap-4'
        >
          <View className='flex-row gap-4'>
            <TextInput 
              placeholder='First Name'
              className='flex-1 border border-gray-300 p-3 rounded-lg focus:border-green-600'
              value={form.firstname}
              onChangeText={(val) => setForm((p) => ({ ...p, firstname: val }))}
            />
            <TextInput 
              placeholder='Last Name'
              className='flex-1 border border-gray-300 p-3 rounded-lg focus:border-green-600'
              value={form.lastname}
              onChangeText={(val) => setForm((p) => ({ ...p, lastname: val }))}
            />
          </View>
          <View className='flex-row gap-4'>
            <BarangaySelect 
              placeholder='Barangay'
              className='w-[70%] border border-gray-300 p-3 rounded-lg focus:border-green-600'
              value={form.barangay}
              onSelect={(val) => setForm((p) => ({ ...p, barangay: val }))}
              items={barangays ? barangays.map((x: any) => x?.brgy_name) : []}
            />
            <TextInput 
              placeholder='Purok'
              className='flex-1 border border-gray-300 p-3 rounded-lg focus:border-green-600'
              value={form.purok}
              onChangeText={(val) => setForm((p) => ({ ...p, purok: val }))}
              keyboardType='number-pad'
            />
          </View>
          <View className='flex-row gap-4'>
            <TouchableOpacity
              className='flex-1 border border-gray-300 rounded-lg px-3'
              onPress={() => {
                DateTimePickerAndroid.open({
                  mode: 'date',
                  value: form.birthdate,
                  onChange: (e, d) => d && setForm((p) => ({ ...p, birthdate: d }))
                })
              }}
            >
              <TextInput 
                placeholder='Birthdate'
                editable={false}
                value={form.birthdate ? dayjs(form.birthdate).format('MM/DD/YYYY') : ''}
              />
            </TouchableOpacity>
            <CustomSelect 
              value={form.gender}
              className='flex-1 border border-gray-300 p-3 rounded-lg focus:border-green-600'
              items={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]}
              placeholder='Gender'
              onSelect={(val) => setForm((p) => ({ ...p, gender: val }))}
            />
          </View>
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
            className='border border-gray-300 p-3 rounded-lg focus:border-green-600'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry
            value={form.password}
            onChangeText={(val) => setForm((p) => ({ ...p, password: val }))}
          />
          {fieldErr && (
            <Text className='text-red-500'>{fieldErr}</Text>
          )}
          <Pressable 
            className='w-full rounded-lg p-3 bg-green-600 active:opacity-50'
            onPress={() => {
              setFieldErr('')
              const { code, ...required } = form
              if (Object.values(required).some(v => !v)) {
                setFieldErr('Please fillup all fields.')
                return
              }
              reqCode()
            }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className='text-center text-white'>Submit</Text>
            )}
          </Pressable>
          <Pressable 
            className='w-full rounded-lg text-center p-3 active:opacity-50'
            onPress={() => router.replace('/login')}
          >
            <Text className='text-center text-green-600'>Already have an account?</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}