import { View, Text } from 'react-native'
import React from 'react'
import { Header } from '@/components/utils/Header'

export default function Home() {
  return (
    <View>
      <Header title="Home" showNotification showBack />
      <Text>Home</Text>
    </View>
  )
}