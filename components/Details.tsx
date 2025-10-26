import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  selected: any,
  onClose: () => void
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:4000";

export default function Details({ selected, onClose }: Props) {
  return (
    <Modal
      visible={selected ? true : false}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View
        className='flex-1 bg-gray-950/40 items-center justify-center'
      >
        <View className='bg-white rounded-lg w-[90%] p-6 gap-4'>
          <DetailsContent 
            data={selected}
          />
          <View className='flex-row justify-end'>
            <TouchableOpacity onPress={onClose} className='flex p-3'>
              <Text className='text-blue-400'>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export const DetailsContent = ({ data }: { data: any }) => {
  const [location, setLocation] = useState("")
  
  const fetchLocation = async (lat: string, lon: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/reverse-geocode?lat=${lat}&lon=${lon}`,
      );
      const data = await response.json();
      return setLocation(data.display_name || "View in Map");
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return setLocation("View");
    }
  }

  useEffect(() => {
    if (data?.latitude && data?.longitude) {
      fetchLocation(data.latitude, data.longitude)
    }
  }, [[data?.latitude, data?.longitude]])

  // useEffect(() => {
  //   return reverseGeocode(data?.latitude, data?.longitude)
  // }, [data?.latitude, data?.longitude])

  return (
    <View className='gap-4'>
      <Text className='text-lg font-medium'>Details</Text>
      {data?.product?.image && (
        <View>
          <Image 
            className='mx-auto aspect-square w-1/2 object-center object-cover'
            source={{ uri: data?.product?.image }}
          />
        </View>
      )}
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-600'>Barcode</Text>
        <Text className='font-medium'>{data?.product ? data?.product?.barcode : data?.manufacturer?.barcode}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-600'>Manifacturer</Text>
        <Text className='font-medium w-2/3 text-right'>{data?.product ? data?.product?.manufacturer : data?.manufacturer?.name}</Text>
      </View>
      {data?.product && (
        <>
          <View className='flex-row items-center justify-between'>
            <Text className='text-gray-600'>Name</Text>
            <Text className='font-medium w-2/3 text-right'>{data?.product?.name}</Text>
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='text-gray-600'>Description</Text>
            <Text className='font-medium'>{data?.product?.description}</Text>
          </View>
        </>
      )}
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-600'>Quantity</Text>
        <Text className='font-medium'>{data?.quantity}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-600'>Date scanned</Text>
        <Text className='font-medium'>{dayjs(data?.scannedAt).format('MMM DD YYYY h:m a')}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-600'>Location</Text>
        <Text className='font-medium w-2/3 text-right'>{location}</Text>
      </View>
    </View>
  )
}