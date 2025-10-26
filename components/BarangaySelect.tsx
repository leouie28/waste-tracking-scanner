import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, type TouchableOpacityProps } from 'react-native';

type Props = {
  onSelect: (val: string) => void
  placeholder?: string,
  value: string,
  items: string[]
} & TouchableOpacityProps

export default function BarangaySelect(props: Props) {
  const { onSelect, placeholder, items, value, ...restProps } = props
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const list = useCallback(() => {
    return search ? items.filter((x) => x.includes(search)) : items
  }, [items, search])

  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.6}
        style={[styles.container, restProps.style]} 
        {...restProps}
        onPress={() => setOpen(true)}
      >
        <TextInput 
          placeholder={placeholder||"Select"}
          editable={false}
          value={value}
        />
        <AntDesign name="caret-down" size={15} color="gray" />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View className='flex-1 items-center justify-center bg-gray-600/10'>
            <View className='w-9/12 bg-white gap-2 p-3 rounded-md h-[40%]'>
              <TextInput 
                placeholder='Search'
                className='border p-3 border-gray-300 rounded-lg'
                clearButtonMode='always'
                value={search}
                onChangeText={(text) => setSearch(text)}
              />
              <FlatList 
                contentContainerClassName='gap-2'
                showsVerticalScrollIndicator={false}
                data={list()}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity 
                      className='p-2 flex-row justify-between'
                      onPress={() => {
                        item != value && onSelect(item)
                        setOpen(false)
                      }}
                    >
                      <Text>{item}</Text>
                      {value == item && <FontAwesome5 name="check" size={12} color="black" />}
                    </TouchableOpacity>
                  )
                }}
              />
              {/* {items.map((item, i) => (
                <TouchableOpacity 
                  className='p-2 flex-row justify-between'
                  key={i}
                  onPress={() => {
                    item.value != value && onSelect(item.value)
                    setOpen(false)
                  }}
                >
                  <Text>{item.label}</Text>
                  {value == item.value && <FontAwesome5 name="check" size={12} color="black" />}
                </TouchableOpacity>
              ))} */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 2
  }
})