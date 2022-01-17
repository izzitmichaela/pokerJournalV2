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

        //Location of thecard images to be used in the app
        var imageMap = {
            'blank' : require('../pictures/cardBack.png'),
            'AceS' : require('../pictures/Spades/A.png'),
            'TwoS' : require('../pictures/Spades/2.png'),
            'ThreeS' : require('../pictures/Spades/3.png'),
            'FourS' : require('../pictures/Spades/4.png'),
            'FiveS' : require('../pictures/Spades/5.png'),
            'SixS' : require('../pictures/Spades/6.png'),
            'SevenS' : require('../pictures/Spades/7.png'),
            'EightS' : require('../pictures/Spades/8.png'),
            'NineS' : require('../pictures/Spades/9.png'),
            'TenS' : require('../pictures/Spades/10.png'),
            'JackS' : require('../pictures/Spades/J.png'),
            'QueenS' : require('../pictures/Spades/Q.png'),
            'KingS' : require('../pictures/Spades/K.png'),
    
            'AceC' : require('../pictures/Clubs/A.png'),
            'TwoC' : require('../pictures/Clubs/2.png'),
            'ThreeC' : require('../pictures/Clubs/3.png'),
            'FourC' : require('../pictures/Clubs/4.png'),
            'FiveC' : require('../pictures/Clubs/5.png'),
            'SixC' : require('../pictures/Clubs/6.png'),
            'SevenC' : require('../pictures/Clubs/7.png'),
            'EightC' : require('../pictures/Clubs/8.png'),
            'NineC' : require('../pictures/Clubs/9.png'),
            'TenC' : require('../pictures/Clubs/10.png'),
            'JackC' : require('../pictures/Clubs/J.png'),
            'QueenC' : require('../pictures/Clubs/Q.png'),
            'KingC' : require('../pictures/Clubs/K.png'),
    
            'AceD' : require('../pictures/Diamonds/A.png'),
            'TwoD' : require('../pictures/Diamonds/2.png'),
            'ThreeD' : require('../pictures/Diamonds/3.png'),
            'FourD' : require('../pictures/Diamonds/4.png'),
            'FiveD' : require('../pictures/Diamonds/5.png'),
            'SixD' : require('../pictures/Diamonds/6.png'),
            'SevenD' : require('../pictures/Diamonds/7.png'),
            'EightD' : require('../pictures/Diamonds/8.png'),
            'NineD' : require('../pictures/Diamonds/9.png'),
            'TenD' : require('../pictures/Diamonds/10.png'),
            'JackD' : require('../pictures/Diamonds/J.png'),
            'QueenD' : require('../pictures/Diamonds/Q.png'),
            'KingD' : require('../pictures/Diamonds/K.png'),
    
            'AceH' : require('../pictures/Hearts/A.png'),
            'TwoH' : require('../pictures/Hearts/2.png'),
            'ThreeH' : require('../pictures/Hearts/3.png'),
            'FourH' : require('../pictures/Hearts/4.png'),
            'FiveH' : require('../pictures/Hearts/5.png'),
            'SixH' : require('../pictures/Hearts/6.png'),
            'SevenH' : require('../pictures/Hearts/7.png'),
            'EightH' : require('../pictures/Hearts/8.png'),
            'NineH' : require('../pictures/Hearts/9.png'),
            'TenH' : require('../pictures/Hearts/10.png'),
            'JackH' : require('../pictures/Hearts/J.png'),
            'QueenH' : require('../pictures/Hearts/Q.png'),
            'KingH' : require('../pictures/Hearts/K.png'),
    
        }

    const [remountCount, setRemountCount] = useState(0);
    const refresh = () => {
        setRemountCount(remountCount + 1)
    }

    const {record} = route.params;
    const [posDispArray, setPosDispArray] = useState();
    const [posArray, setPosArray] = useState(['??', '??', '??', '??', '??', '??', '??', '??', '??']);
    const [buttonArray, setButtonArray] = useState();
    const [textArray, setTextArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [styleCodes, setStyleCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]) //0 = default, 1 = dealer, 2 = sb, 3 = bb, 4 = active 5 = folded
    const [players, setPlayers] = useState(9);
    const [stage, setStage] = useState('Init.')
    const [activePlayer, setActivePlayer] = useState(0);
    const [flavorArray, setFlavorArray] = useState([]);
    const [flavorText, setFlavorText] = useState(['                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ']);
    const [bankrollArray, setBankrollArray] = useState();
    const [bankroll, setBankroll] = useState([0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]);
    const [pot, setPot] = useState(0);

    const [boardCardArray, setBoardCardArray] = useState(['blank', 'blank', 'blank', 'blank','blank']);
    const [holeCardArray, setHoleCardArray] = useState(['blank', 'blank']);
    const [wonCardArray, setWonCardArray] = useState(['blank', 'blank']);

    const [holeArray, setHoleArray] = useState([])
    const [boardArray, setBoardArray] = useState([])

    const [currentLine, setCurrentLine] = useState('Game Start');
    const [currentLineInd, setCurrentLineInd] = useState(0);
    const [recordArray, setRecordArray] = useState(record.split('/n'));




    const [editPButtonArray, setEditPButtonArray]  = useState([]);


    React.useEffect(() => {
        //setStyleCodes(updateStyle(dealerValue, activePlayer))
        //setTextArray(updateText(dealerValue, activePlayer))
        setButtonArray(createPlayerArray())
        setBankrollArray(updateBankroll())
        setFlavorArray(createFlavorArray())
        setPosDispArray(createPosDispArray())
        setEditPButtonArray(createButArray())
        setHoleArray(createHoleArray())
        setBoardArray(createBoardArray())
    
    }, [remountCount])

    //CREATION FUNCTIONS

    const createButArray = () => {
        var temp = []
        for (let i = 0; i<textArray.length; i++) {
            temp.push(
                <TouchableOpacity style={styles.editButton} key={i} onPress={() => {
                    setActivePlayerOptions(i);
                    setHCModalVisible(!HCModalVisible)}}>
                    <Text style={styles.editButtonText}>
                           { "   Det.   "}
                    </Text>
                </TouchableOpacity>,
            )
    
        }

        return temp
    }

    const createPosDispArray = () => {
        var temp = []

        for (let i = 0; i < textArray.length; i++) {
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

        for (let i=0; i < textArray.length; i++) {

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

    
    const createFlavorArray = () => {

        var temp = []

        for (let i=0; i < textArray.length; i++) {
            if (i == activePlayer) {
                temp.push(<Text style={styles.activeFlavor} key={i}>{flavorText[i]}</Text>)
            } else {
                temp.push(<Text style={styles.default} key={i}>{flavorText[i]}</Text>)
            }
            
        }

        return temp

    }

    const updateBankroll = () => {
        let temp = []

        for (let i=0; i < textArray.length; i++) {
           
            if (i == activePlayer) {
                temp.push(<Text style={styles.activeBankRoll} key = {i}> {'$' + bankroll[i] + ' '}</Text>)
            } else {
                temp.push(<Text style={styles.default} key = {i}> {'$' + bankroll[i] + ' '}</Text>)
            }          
        }

        console.log('BANKROLL ARRAY',temp)

        return temp
    }


    const createBoardArray = () => {
        let temp = []

        
        for (let i=0; i<5; i++) {

 
            temp.push( 
                <Image source={imageMap[boardCardArray[i]]}  style={styles.img} key={i}/>
            )
            
        }

        return temp
    
    }

    const createHoleArray = () => {
        let temp = []

        
        for (let i=0; i<2; i++) {

 
            temp.push( 
                <Image source={imageMap[holeCardArray[i]]}  style={styles.img} key={i}/>
            )
            
        }

        return temp
    
    }

    const winnerCards = () => {
        let temp = []

        for (let i=0; i<2; i++) {

 
            temp.push( 
                <Image source={imageMap[wonCardArray[i]]}  style={styles.img} key={i}/>
            )
            
        }

        return temp
    
    }

    const readNextLine = () => {

        //Goes through the record and updates all the parameter arrays according to it
        line = recordArray[currentLineInd]

        //Checks to see if it is the start of the hand. if so, updates player array, changes to 'Preflop and moves to first action
        let tempNames = []
        let tempPos = []
        let tempBank = []
        let count = 2



        //First, checks to see if it is the start of the file

        if (line.includes('Game Record')) {
            setCurrentLineInd(currentLineInd + 2)
        } else if (line.includes('Hand')) {
            
            while (recordArray[currentLineInd + count].includes('PREFLOP') == false) {

                cl = recordArray[currentLineInd + count]
                nameEndInd = cl.indexOf('(')
                posStartInd = cl.indexOf('(') + 1
                posEndInd = posStartInd + 3
                bankStartInd = cl.indexOf('$') + 1

                 

                tempNames.push(cl.substring(0,nameEndInd))
                tempPos.push(cl.substring(posStartInd, posEndInd))
                tempBank.push(cl.substring(bankStartInd, cl.length))
                count++
                           
            }
            setPlayers(count + 1)
            setTextArray(tempNames)
            setBankroll(tempBank)
            setPosArray(tempPos)
            setCurrentLineInd(currentLineInd + count)
            refresh()
        } else if (line.includes('PREFLOP')) {
            setStage('Preflop')
            setCurrentLineInd(currentLineInd + 1)

        } else if (line.includes('FLOP')) {
            setStage('Flop')
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('TURN')) {
            setStage('Turn')
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('RIVER')) {
            setStage('River')
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('RESULTS')) {
            setStage('Results')
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('HOLE')){
            let temp = []

            card1Ind = line.indexOf('[') + 1
            card1EndInd = line.indexOf('/') - 1
            card2Ind = line.indexOf('/') + 2
            card2EndInd = line.indexOf(']')

            temp = [line.substring(card1Ind, card1EndInd) , line.substring(card2Ind, card2EndInd) ]

            setHoleCardArray(temp)
            setCurrentLineInd(currentLineInd + 1)
    
        } else if (line.includes('BOARD')) {

            let temp = []

            lineArray = line.split('/') 

            bCard1 = lineArray[0].substring(8, lineArray[0].length)
            bCard2 = lineArray[1].substring(1, lineArray[1].length)
            bCard3 = lineArray[2].substring(1, lineArray[2].length)

            temp = [bCard1 , bCard2, bCard3]

            setHoleCardArray(temp)
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('POT')) {
            newNum = parseFloat(line.substring(line.indexOf('$') + 1, line.length))
            setPot(newNum)
            setCurrentLineInd(currentLineInd + 1)
        }else if (line.includes('Bet')) {
            let temp = []
            let bankTemp = []
            targetIndex = 0
            n = line.substring(0, line.indexOf(' Bet'))
            money = line.substring(line.indexOf('$'), line.length)

            for (let i = 0; i<textArray.length; i++) {
                if (textArray[i].includes(n)) {
                    temp.push('Bet $' + money)
                    bankTemp.push(bankroll[i] - parseFloat(money))


                } else {
                    temp.push(flavorArray[i])
                    bankTemp.push(bankroll[i])
                }
            }

            setFlavorArray(temp)
            setBankroll(bankTemp)
            setCurrentLineInd(currentLineInd + 1)
            
        }else if (line.includes('Check')) {
            let temp = []
            targetIndex = 0
            n = line.substring(0, line.indexOf('        Check'))

            for (let i = 0; i<textArray.length; i++) {
                if (textArray[i].includes(n)) {
                    temp.push('        Check        ')

                } else {
                    temp.push(flavorArray[i])
                }
            }

            setFlavorArray(temp)
            setCurrentLineInd(currentLineInd + 1)

        }else if (line.includes('Call')) {

        }else if (line.includes('Raise')) {

        }else if (line.includes('Fold')) {

        }else if (line.includes('Wins')) {
            
        } else {
            setCurrentLineInd(currentLineInd + 1)
        }


        setCurrentLine(recordArray[currentLineInd])

        refresh()


    }

    //RETURN STATEMENT-----------------------------------------------------------------------

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

                    <View>
                        {flavorArray}
                    </View>

                    <View>
                        {bankrollArray}
                    </View>

                    <View>
                        {editPButtonArray}
                    </View>       
                </View>

                 
                <View style={styles.rowSpBet}>
                    <Text style={styles.potStyle}>{"Pot: $"}{pot.toFixed(2)}</Text>
                    <Text style={styles.stageStyle}>{"Stage: "}{stage}</Text>
                </View> 
            </View>



            <View style={styles.midSegment}>                      
                <View style={styles.row}>
                    {boardArray}
                </View>

                <View style={styles.row}>
                    <View style={styles.cardGroup}>
                        {holeArray}

                    </View>

                    {/* <View style={styles.cardGroup}>
                        {winnerCards()}

                    </View>                  */}
                    
                </View>

                <View>
                    <Text style={styles.instructions}>{currentLine}</Text>
                </View>
            </View>

            <View style={styles.bottomRow}>

                <TouchableOpacity style={styles.editButton} key={0} onPress={() => {
                    }}>
                    <Text style={styles.editButtonText}>
                        { "   Prev. Hand   "}
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.editButton} key={1} onPress={() => {
                    readNextLine()
                    }}>
                    <Text style={styles.editButtonText}>
                        { "   Next Action.   "}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editButton} key={2} onPress={() => {
                    }}>
                    <Text style={styles.editButtonText}>
                        { "   Next Hand.   "}
                    </Text>
                </TouchableOpacity>


            </View>


        </ImageBackground>
    );


};

const styles = StyleSheet.create({

    instructions: {
        //flex: 0.2,
        backgroundColor: "rgb(0,0,205)",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        opacity: 0.8,
        color: "white",
        borderWidth: 0.7,
        borderColor: "rgb(0,191,255)", 
    },
    
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
        justifyContent: 'space-between',
        //justifyContent: 'center'
    },

    bottomRow: {
        flex: 0.2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        //justifyContent: 'center'
    },

    cardGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        //justifyContent: 'space-between',
        justifyContent: 'center'
    },

    rowSpBet: {
        //flex: 1,
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


