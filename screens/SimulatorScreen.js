import * as React from 'react';
import { Component } from 'react'
import { useState } from "react";
import { useCallback } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Image, Button} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import moment from 'moment';
import {Dimensions} from 'react-native';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrollPicker from 'react-native-scroll-wheel-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';



var { height, width } = Dimensions.get('window');


export default function SimulatorScreen( {route, navigation} ){

    const [remountCount, setRemountCount] = useState(0);
    const refresh = () => {
        setRemountCount(remountCount + 1)
    }

    const {record} = route.params;
    const [posDispArray, setPosDispArray] = useState()
    const [posArray, setPosArray] = useState(['??', '??', '??', '??', '??', '??'])
    const [buttonArray, setButtonArray] = useState();
    const [textArray, setTextArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [styleCodes, setStyleCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]) //0 = default, 1 = dealer, 2 = sb, 3 = bb, 4 = active 5 = folded
    const [players, setPlayers] = useState(6)
    


    React.useEffect(() => {
        //setStyleCodes(updateStyle(dealerValue, activePlayer))
        //setTextArray(updateText(dealerValue, activePlayer))
        setButtonArray(createPlayerArray())
        //setBankrollArray(updateBankroll())
        //setFlavorArray(createFlavorArray())
        setPosDispArray(createPosDispArray())
        //console.log(posArray)
    
    }, [remountCount])

    //CREATION FUNCTIONS

    const createPosDispArray = () => {
        var temp = []

        for (let i = 0; i < players; i++) {
            if (posArray[i] == " DE ") {
                temp.push(<Text style={styles.dealerPosSt} key={i}>{posArray[i]}</Text>)
            } else if (posArray[i] == " BB " || posArray[i] == " SB ") {
                temp.push(<Text style={styles.blindPosSt} key={i}>{posArray[i]}</Text>)
            } else {
                temp.push(<Text style={styles.defaultPosSt} key={i}>{posArray[i]}</Text>)
            }
            
        }

        return temp
    }

    const createPlayerArray = () => {
        var temp = []

        for (let i=0; i < players; i++) {

            if (styleCodes[i] < 4) {
                temp.push(<Text style={styles.default} key={i}>{textArray[i]}</Text>)

            }

            if (styleCodes[i] == 4) {
                temp.push(<Text style={styles.activePlayer} key={i}>{textArray[i]}</Text>)

            }

            if (styleCodes[i] == 5) {
                temp.push(<Text style={styles.default} key={i}>{textArray[i]}</Text>)

            }
            
        }
        return temp
    }

    return (
        
        <ImageBackground style={ styles.imgBackground } 
            resizeMode='cover' 
            source={require('../pictures/Backgrounds/placeholder.jpg')}>

            <View style={styles.topSegment}>
                <View style={styles.butRow}>
                    <View>
                        {posDispArray}
                    </View>

                    <View>
                        {buttonArray}
                    </View>

                    {/* <View>
                        {flavorArray}
                    </View>

                    <View>
                        {bankrollArray}
                    </View>

                    <View>
                        {editPButtonArray}
                    </View>        */}
                </View>

{/*                 
                <View style={styles.rowSpBet}>
                    <Text style={styles.potStyle}>{"Pot: $"}{pot.toFixed(2)}</Text>
                    <Text style={styles.stageStyle}>{"Stage: "}{'Unknown'}</Text>
                </View> */}
            </View>

            <View>

                <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
                <Button title="Go back" onPress={() => navigation.goBack()} />
                <Button title="Test Print" onPress={() => console.log(record)} />

            </View>

        </ImageBackground>
    );


};

const styles = StyleSheet.create({
    topSegment: {
        flex: 0.49,
    },

    midSegment: {
        flex: 0.31,
    },

    botSegment: {
        flex: 0.2,
    },

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    container: {
        flex: 1,
        backgroundColor: "#7CA1B4",
        alignItems: "center",
        justifyContent: "center",
    },

    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        //justifyContent: 'space-between',
        justifyContent: 'center'
    },

    rowSpBet: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        //justifyContent: 'center'
    },

    butRow: {
        flex: 1.8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },

    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    default: {
        alignItems: "center",
        textAlign: "center",
        //backgroundColor: "rgb(46,139,87)",
        backgroundColor: "rgb(0,0,0)",
        fontSize: 16,
        borderWidth: 0.7,
        //borderColor: "rgb(255,215,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        opacity: 0.7,
        color: "white"
    },

    defaultPosSt: {
        alignItems: "center",
        textAlign: "center",
        color: "black",
        fontSize: 17,
        //borderColor: "rgb(255,215,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        opacity: 1
    },

    dealer: {
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "white",
        fontSize: 16,
        borderWidth: 0.7,
        borderColor: "rgb(255,215,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        borderColor: "rgb(255,215,0)",
        opacity: 1
    },

    activePlayer: {
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "rgb(139,0,0)",
        fontSize: 16,
        borderWidth: 0.7,
        borderBottomColor: "rgb(255,0,0)",
        borderLeftColor: "rgb(255,0,0)",
        borderTopColor: "rgb(255,0,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        //borderColor: "rgb(255,215,0)",
        opacity: 1,
        color: "white",
    },

    activeFlavor: {
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "rgb(139,0,0)",
        fontSize: 16,
        borderWidth: 0.7,
        borderBottomColor: "rgb(255,0,0)",
        borderTopColor: "rgb(255,0,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        //borderColor: "rgb(255,215,0)",
        opacity: 1,
        color: "white",
    },

    activeBankRoll: {
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "rgb(139,0,0)",
        fontSize: 16,
        borderWidth: 0.7,
        borderBottomColor: "rgb(255,0,0)",
        borderRightColor: "rgb(255,0,0)",
        borderTopColor: "rgb(255,0,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        //borderColor: "rgb(255,215,0)",
        opacity: 1,
        color: "white",
    },


    dealerPosSt: {
        alignItems: "center",
        textAlign: "center",
        color: "rgb(255,255,255)",
        fontSize: 17,
    },

    blindPosSt: {

        alignItems: "center",
        textAlign: "center",
        color: "rgb(255,215,0)",
        fontSize: 17,

    },

    potStyle: {

        fontSize: 18,


    },

    stageStyle: {
        fontSize: 18,

    },


    img: {

        width: 75,
        height: undefined,
        aspectRatio: 8.5/11,
        alignItems: "center",
        resizeMode: 'contain'

    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    modalView: {
        margin: 10,
        opacity: 0.9,
        backgroundColor: "rgb(0,150,0)",
        borderColor: "rgb(255,255,255)",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "rgb(255,50,0)",
        borderWidth: 0.7,
        borderColor: "rgb(255,255,255)", 
    },

    buttonOpen: {
        backgroundColor: "#F194FF",
    },

    buttonClose: {
        backgroundColor: "rgb(255,50,0)",
    },

    basicButton: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.7,
        borderColor: "rgb(255,215,0)", 
        padding: 10,
        elevation: 0,
        zIndex: 0,
        backgroundColor: "black",
        opacity: 1
    },

    basicButtonText: {

        color: "rgb(255,215,0)",

    },

    cardSelectText: {

        color: "rgb(255,215,0)",
        fontSize: 20,


    },

    editButton: {
        borderWidth: 0.7,
        borderRadius: 20,
        borderColor: "rgb(255,215,0)", 
        padding: 0,
        elevation: 0,
        zIndex: 0,
        backgroundColor: "rgb(0,0,0)",
        opacity: 1
    },

    editButtonText: {
        fontSize: 16,
        color: "rgb(255,215,0)"
    },


    textStyle: {
        color: "rgb(255,255,255)",
        fontWeight: "bold",
        textAlign: "center",
    },

    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        paddingRight: 10,
        lineHeight: 23,
        //flex: 2,
        textAlignVertical: 'top',
        width: width / 2,
        height: height / 10
    },

    rowModal: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'

    },

    nameTextSt: {
        backgroundColor: "white",

    },

    cardSelectSt: {

        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "rgb(139,0,0)",
        borderWidth: 0.7,
        borderColor: "rgb(255,215,0)",

    },

    cardOptionSt: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "black",
        borderWidth: 0.7,
        borderColor: "black", 
    },

    spadeOption: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "black",
        borderWidth: 0.7,
        borderColor: "black", 
    },

    clubOption: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "green",
        borderWidth: 0.7,
        borderColor: "rgb(0,100,0)", 
    },

    diamondOption: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "blue",
        borderWidth: 0.7,
        borderColor: "blue", 
    },

    heartOption: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        zIndex: 0,
        backgroundColor: "red",
        borderWidth: 0.7,
        borderColor: "red", 
    },

});


