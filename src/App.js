import React from 'react'
import { AppLoading } from 'expo'
import { Card, CardItem, Container, Content, Body } from 'native-base'
import { StyleSheet, Text, View } from 'react-native'

export default function App({ navigation }) {
  return (
    <Container>
      <Content>
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Card>
            <CardItem
              button
              onPress={() => {
                navigation.navigate('Preliminary Analysis')
              }}>
              <Body>
                <Text>Preliminary Analysis</Text>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem button
              onPress={() => {
                navigation.navigate('Rating Analysis')
              }}>
              <Body>
                <Text>Rating Analysis</Text>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem button
              onPress={() => {
                navigation.navigate('Saved')
              }}>
              <Body>
                <Text>Saved document</Text>
              </Body>
            </CardItem>
          </Card>
        </View>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})
