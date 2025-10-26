import Details from '@/components/Details'
import api from '@/lib/api'
import { useFocusEffect } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabHistoryScreen() {
  const [selected, setSelected] = useState<any>(null)
  const [q, setQ] = useState({
    take: 10,
    skip: 0
  })

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['history'],
    queryFn: async () => (await api.get('/scan', { params: q })).data,
    enabled: false
  })

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  return (
    <>
      <SafeAreaView className='flex-1' edges={[]}>
        <FlatList 
          contentContainerClassName='gap-4 p-4'
          data={data?.rows||[]}
          renderItem={(_) => <Item d={_.item} select={(d) => setSelected(d)} />}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View className='p-4'>
              <Text className='text-center'>No scan history found.</Text>
            </View>
          }
        />
      </SafeAreaView>
      <Details 
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

const Item = ({ d, select }: { d: any, select: (d: any) => void }) => {
  return (
    <TouchableOpacity onPress={() => select(d)} className='bg-white rounded-lg p-4 flex-row gap-2 justify-between w-full'>
      <View className='w-2/3'>
        <Text className=''>{d?.product ? d?.product?.manufacturer : d?.manufacturer?.name}</Text>
        <Text className='text-sm text-gray-600'>Barcode: {d?.product ? d?.product?.barcode : d?.manufacturer?.barcode}</Text>
      </View>
      <Text className='flex-1 text-xs text-right text-gray-500'>{dayjs(d?.scannedAt).format('MM/DD/YYYY h:m a')}</Text>
    </TouchableOpacity>
  )
}