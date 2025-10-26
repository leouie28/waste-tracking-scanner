import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { useCallback, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, type TouchableOpacityProps } from 'react-native';

type Props = {
  onSelect: (val: string) => void
  placeholder?: string,
  value: string,
  items: { value: string, label: string }[]
} & TouchableOpacityProps

export default function CustomSelect(props: Props) {
  const { onSelect, placeholder, items, value, ...restProps } = props
  const [open, setOpen] = useState(false)

  const valueText = useCallback(() => {
    return value ? items.find((x) => x.value == value)?.label : ""
  }, [value])

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
          value={valueText()}
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
            <View className='w-9/12 bg-white gap-2 p-3 rounded-md'>
              {items.map((item, i) => (
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
              ))}
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