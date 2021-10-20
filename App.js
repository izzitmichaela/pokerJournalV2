// In App.js in a new project

import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SessionScreen from './screens/SessionScreen.js'
import HistoryScreen from './screens/HistoryScreen.js'
import SetupScreen from './screens/SetupScreen.js'

function HomeScreen( { navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home screen</Text>
      <Button
      title="Play Poker!"
      onPress={() => navigation.navigate('SetupScreen')}
      />
    
      <Button
      title="Go to History Screen"
      onPress={() => navigation.navigate('HistoryScreen')}
      />
    </View>
  );
}


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SetupScreen" component={SetupScreen} />
        <Stack.Screen name="SessionScreen" component={SessionScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;