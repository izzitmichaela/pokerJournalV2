import * as React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useState} from "react";
import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function SetupScreen( {navigation} ){

    const [defaultColor, setDefaultColor] = useState("blue")

    const [playerButtons, setPayerButtons] = useState([

        <TouchableOpacity style = {styles.button} key ={0}>
            <Text>Hero</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={1}>
            <Text>Villain 1</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={2}>
            <Text>Villain 2</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={3}>
            <Text>Villain 3</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={4}>
            <Text>Villain 4</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={5}>
            <Text>Villain 5</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={6}>
            <Text>Villain 6</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={7}>
            <Text>Villain 7</Text>
        </TouchableOpacity>,

        <TouchableOpacity style = {styles.button} key ={8}>
            <Text>Villain 8</Text>
        </TouchableOpacity>,

    ]);
    

    const [playersOpen, setPlayersOpen] = useState(false);
    const [playersValue, setPlayersValue] = useState(null);
    const [playersItems, setPlayersItems] = useState([
        {label: '4-Max', value: 4},
        {label: '6-Max', value: 6},
        {label: '9-Max', value: 9}

    ]);
   

    const [blindsOpen, setBlindsOpen] = useState(false);
    const [blindsValue, setBlindsValue] = useState(null);
    const [blindsItems, setBlindsItems] = useState([
        {label: '$0.01 / $0.02', value: 0.02},
        {label: '$0.05 / $0.10', value: 0.10},
        {label: '$0.10 / $0.20', value: 0.20},
        {label: '$0.25 / $0.50', value: 0.50},
        {label: '$0.50 / $1.00', value: 1},
        {label: '$1 / $2', value: 2},
        {label: '$2 / $5', value: 5},
        {label: '$5 / $10', value: 10}
    ]);


    return (

        <View style={styles.container}>

            <View>

                <Text>Select Table Size</Text>

                <DropDownPicker
                    zIndex = {3000}
                    zIndexInverse = {1000}
                    open={playersOpen}
                    value={playersValue}
                    items={playersItems}
                    setOpen={setPlayersOpen}
                    setValue={setPlayersValue}
                    setItems={setPlayersItems}
                />

                <Text>Select stakes</Text>

                <DropDownPicker
                    zIndex = {2000}
                    zIndexInverse = {2000}
                    open={blindsOpen}
                    value={blindsValue}
                    items={blindsItems}
                    setOpen={setBlindsOpen}
                    setValue={setBlindsValue}
                    setItems={setBlindsItems}
                />

            </View>

            <View style={styles.buttonSection}>

                <Text>Players: {JSON.stringify(playersValue)}</Text>
                <Text>Blinds: {JSON.stringify(blindsValue)}</Text>

                <Button
                    zIndex = {1000}
                    title={"Begin Session"}
                    onPress={() => {
                        navigation.navigate('SessionScreen', {
                          BV: blindsValue , NP: playersValue,
                        });
                    }}
                />
                <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
                <Button title="Go back" onPress={() => navigation.goBack()} />

            </View>
        </View>
    
            
    );

};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
       flexDirection: 'column',
       justifyContent: 'space-between',
       alignItems: 'center',
       backgroundColor: 'green',
    },
    buttonSection: {
        height: 300
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
    }
})
