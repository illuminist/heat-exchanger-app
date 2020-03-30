import * as React from 'react'
import { Item, Label, Text } from 'native-base'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    padding: 16,
  },
  label: {
    marginBottom: 4,
    color: 'rgba(0,0,0,0.6)'
  }
})

export default ({ label, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text>{children}</Text>
    </View>
  )
}
