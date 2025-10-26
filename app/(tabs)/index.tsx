import { DetailsContent } from "@/components/Details";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabScannerScreen() {
  const [code, setCode] = useState('')
  const cameraRef = useRef<CameraView | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [qty, setQty] = useState(1)
  const [isNew, setIsnNew] = useState(true)

  const { data, mutate, isPending, error } = useMutation({
    mutationFn: async () => (await api.post('/scan', { code, lat: location?.coords.latitude, lng: location?.coords.longitude, qty })).data,
    onSuccess: (data) => {
      setQty(1)
      console.log(data)
    },
    onError: (err: any) => {
      console.log(err?.response)
    }
  })

  // const decodeLocation = async (lat: number|null, lng: number) => {
  //   try {
  //     const res = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
  //       { headers: { "User-Agent": "wast-scanner-expo-app/1.0 (leouietabique@gmail.com)" } }
  //     );
  //     const data = await res.json()
  //     console.log(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const getLocation = async () => {
    // Ask for permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") {
    //   setErrorMsg("Permission to access location was denied");
    //   return;
    // }

    // Get current position
    const currentLocation = await Location.getCurrentPositionAsync({})
    setLocation(currentLocation);
    const lat = currentLocation.coords.altitude
    const lng = currentLocation.coords.longitude
    // await decodeLocation(lat, lng)
    return
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    getLocation();
  }, []);

  if (hasPermission === null) {
    return <View />; // loading
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  return (
    <>
      <SafeAreaView className='flex-1 p-8 pb-10 gap-8 justify-center' edges={[]}>
        <View className="gap-2">
          <View className='bg-gray-950 aspect-square w-full rounded-lg overflow-hidden'>
            {!code && (
              <CameraView
                style={{ flex: 1, backgroundColor: 'black' }} 
                facing='back' 
                ref={cameraRef}
                ratio='1:1'
                onBarcodeScanned={(result) => {
                  setCode(result.data)
                  setIsnNew(true)
                  // mutate(result.data)
                }}
              />
            )}
          </View>
          <Text className="text-center">Scan the product barcode</Text>
        </View>
      </SafeAreaView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={code ? true : false}
        // visible={true}
        onRequestClose={() => {}}
      >
        <View className='flex-1 bg-gray-950/40 items-center justify-center'>
          <View className='bg-white rounded-lg w-[90%] p-6'>
            {isNew ? (
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-gray-500">Barcode</Text>
                  <TextInput 
                    className="p-3 border border-gray-300 rounded-lg"
                    editable={false}
                    value={code}
                  />
                </View>
                <View className="gap-2">
                  <Text className="text-gray-500">Quantity</Text>
                  <TextInput 
                    className="p-3 border border-gray-300 rounded-lg"
                    keyboardType="number-pad"
                    value={qty >= 1 ? qty.toString() : ""}
                    onChangeText={(text) => setQty(Number(text))}
                  />
                </View>
                <View className="flex-row justify-end gap-2">
                  <TouchableOpacity 
                    className="flex-row p-3"
                    onPress={() => {
                      setCode('')
                    }}
                  >
                    <Text className="text-gray-400 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row p-3"
                    onPress={() => {
                      mutate()
                      setIsnNew(false)
                    }}
                  >
                    <Text className="text-blue-400 font-semibold">Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                {isPending ? (
                  <View className='gap-4 py-8'>
                    <ActivityIndicator size='large' />
                    <Text className='text-center'>Processing...</Text>
                  </View>
                ) : (
                  <View className='gap-4'>
                    {error ? (
                      <View className="p-3 bg-red-100 rounded-lg border border-red-200">
                        <Text className="text-lg text-red-500 text-center">Barcode does not exist on dataset!</Text>
                      </View>
                    ) : (
                      <DetailsContent data={data} />
                    )}
                    <View className="flex-row justify-end items-center gap-2 mt-4">
                      <TouchableOpacity 
                        className="p-3"
                        onPress={() => {
                          setCode('')
                          setQty(1)
                        }}
                      >
                        <Text className="text-center text-gray-400">Close</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        className="p-3"
                        onPress={() => {
                          setCode('')
                          setQty(1)
                        }}
                      >
                        <Text className="text-center text-blue-400">Scan another</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}