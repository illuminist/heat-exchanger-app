import React from 'react'
import { AppLoading } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import App from './App'
import Preliminary from './pagemodules/preliminary/PreliminaryLanding'
import Rating from './pagemodules/rating/RatingLanding'
import SavedPage from './pagemodules/saved/SavedPage'
import DialogPrompt from './components/DialogPrompt'

const Drawer = createDrawerNavigator()

export default function AppEntry() {
  const [isReady, setReady] = React.useState(false)
  React.useEffect(() => {
    ;(async () => {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      })
    })().then(() => setReady(true))
  }, [])
  return isReady ? (
    <>
      <DialogPrompt />
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen
            name="Home"
            component={App}
          />
          <Drawer.Screen name="Preliminary Analysis" component={Preliminary} />
          <Drawer.Screen name="Rating Analysis" component={Rating} />
          <Drawer.Screen name="Saved" component={SavedPage} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  ) : (
    <AppLoading />
  )
}
