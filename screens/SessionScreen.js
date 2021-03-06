import * as React from 'react';
import { Component } from 'react'
import { useState } from "react";
import { useCallback } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
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
var record = [];
//Variables denoting the arrays that will store the hand instructions
var currentDate = moment().format("DD/MM/YYYY");
var currentTime = moment().format("LTS")
var handNum = 1


//var RNFS = require('react-native-fs');

//var path = RNFS.DocumentDirectoryPath + '/' + currentDate + '_' + currentTime + '.txt';

export default function SessionScreen({ route, navigation }) {

    //VARIABLE LIST--------------------------------------------------------------------------------------

    

    //This will trigger a refresh on the main arrays anytime we need
    const [remountCount, setRemountCount] = useState(0);
    const refresh = () => {
        setRemountCount(remountCount + 1)
    }

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

    //card picker modal
    const [modalVisible, setModalVisible] = useState(false);

    //File Saver Modal
    const [fileModalVisible, setFileModalVisible] = useState(false);

    //Variables denoting the cards on the board
    const [activeCard, setActiveCard] = useState('');
    const [holeCardActive, setHoleCardActive] = useState(false)
    const [boardCardArray, setBoardCardArray] = useState(['blank', 'blank', 'blank', 'blank','blank']);


    //Variables denoting the attributes in the edit player modal, including hole cards for each player, one modal that will display the appropriate cards depending on what button is pressed
    //Array for all potential players (up to 9), the first two cards will be for player 1, and so on
    //Also includes the player names as well as any notes on the player
    const [HCModalVisible, setHCModalVisible] = useState(false);
    const [HCArray, setHCArray] = useState(['blank', 'blank', 'blank', 'blank','blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank'])
    const [namesArray, setNamesArray] = useState([' Hero ', ' Villain 1 ', ' Villain 2 ', ' Villain 3 ', ' Villain 4 ', ' Villain 5 ', ' Villain 6 ', ' Villain 7 ', ' Villain 8 ']);
    const [playerNotesArray, setPlayerNotesArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [recentNote, setRecentNote] = useState('');
    const [activePlayerOptions, setActivePlayerOptions] = useState();
    const [nameInput, setNameInput] = useState('');
    const [fileNameInput, setFileNameInput] = useState('');

    const [decideWinner, setDecideWinner] = useState(false);
    const [winnerInd, setWinnerInd] = useState(-1);

    const {BV, NP } = route.params;
    const [bigBlind, setBigBlind] = useState(BV);
    const [bbPosted, setbbPosted] = useState(false);  
    const [smallBlind, setSmallBlind] = useState(BV / 2)
    const [sbPosted, setsbPosted] = useState(false);

    const [players, setPlayers] = useState(NP);
    const [realTimePlayers, setRealTimePlayers] = useState(players);
    const [pot, setPot] = useState(0);
    const [stage, setStage] = useState(['Initialization', 'Preflop', 'Flop', 'Turn', 'River', 'Showdown!']);

    const [buttonArray, setButtonArray] = useState();
    const [bankrollArray, setBankrollArray] = useState();
    const [moneyPaid, setMoneyPaid] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [changeBankroll, setChangeBankroll] = useState('')

    //This small loop sets up the player buttons that will be used in the game
    var temp = []
    for (let i = 0; i<players; i++) {
        temp.push(
            <TouchableOpacity style={styles.editButton} key={i} onPress={() => {
                setActivePlayerOptions(i);
                setHCModalVisible(!HCModalVisible)}}>
                <Text style={styles.editButtonText}>
                       { "   Edit   "}
                </Text>
            </TouchableOpacity>,
        )

    }
    const [editPButtonArray, setEditPButtonArray]  = useState(temp);


    

    const [cardSelButtonArray1, setCardSelButtonArray1] = useState([])
    const [cardSelButtonArray2, setCardSelButtonArray2] = useState([])
    const [cardSelButtonArray3, setCardSelButtonArray3] = useState([])
    const [suitSelButtonArray, setSuitSelButtonArray] = useState([])

    const [flavorText, setFlavorText] = useState(['                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            '])
    const [flavorArray, setFlavorArray] = useState([])
    const [styleCodes, setStyleCodes] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]) //0 = default, 1 = dealer, 2 = sb, 3 = bb, 4 = active 5 = folded
    const [justStarted, setJustStarted] = useState(false)
    
    
    const [activePlayer, setActivePlayer] = useState(0);
    const [closeActionInd, setCloseActionInd] = useState(-1);
    const [newBet, setNewBet] = useState('');
    const [highestBet, setHighestBet] = useState(0)
    const [betMade, setBetMade] = useState(false);
    const [numFolded, setNumFolded] = useState(0);
    const [actions, setActions] = useState(realTimePlayers);


    const [textArray, setTextArray] = useState(['', '', '', '', '', '', '', '', '']);
    const [posArray, setPosArray] = useState([])
    const [posDispArray, setPosDispArray] = useState()
    const [bankroll, setBankroll] = useState([(20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2), (20*bigBlind).toFixed(2)])


    const [handRecord, setHandRecord] = useState("Session: " + currentDate + " " + currentTime + "/ Hand #" + handNum + "/n" + "Players: " + players);
    const [actionRecord, setActionRecord] = useState('');
    const [playerRecord, setPlayerRecord] = useState('');
    const [preflopRecord, setPreflopRecord] = useState('');
    const [preflopPot, setPreflopPot] = useState('');
    const [flopRecord, setFlopRecord] = useState('');
    const [flopPot, setFlopPot] = useState('');
    const [turnRecord, setTurnRecord] = useState('');
    const [turnPot, setTurnPot] = useState('');
    const [riverRecord, setRiverRecord] = useState('');
    const [riverPot, setRiverPot] = useState('');
    const [resultsRecord, setResultsRecord] = useState('');
    const [moneyWon, setMoneyWon] = useState('');
    const [r, setR] = useState('')

    var actionRecordTemp = ''

    const [progress, setProgress] = useState(0);
    const [stageButtonActive, setStageButtonActive] = useState(false);
    
    //Set dealer dropdown variables
    const [dealerOpen, setDealerOpen] = useState(false);
    const [dealerValue, setDealerValue] = useState(null);
    const [dealerItems2m, setDealerItems2m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
    ]);
    const [dealerItems3m, setDealerItems3m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
    ]);
    const [dealerItems4m, setDealerItems4m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
    ]);
    const [dealerItems5m, setDealerItems5m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
        { label: 'Villain 4', value: 4 },
    ]);
    const [dealerItems6m, setDealerItems6m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
        { label: 'Villain 4', value: 4 },
        { label: 'Villain 5', value: 5 },
    ]);
    const [dealerItems7m, setDealerItems7m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
        { label: 'Villain 4', value: 4 },
        { label: 'Villain 5', value: 5 },
        { label: 'Villain 6', value: 6 },
    ]);
    const [dealerItems8m, setDealerItems8m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
        { label: 'Villain 4', value: 4 },
        { label: 'Villain 5', value: 5 },
        { label: 'Villain 6', value: 6 },
        { label: 'Villain 7', value: 7 },
    ]);
    const [dealerItems9m, setDealerItems9m] = useState([
        { label: 'Hero', value: 0 },
        { label: 'Villain 1', value: 1 },
        { label: 'Villain 2', value: 2 },
        { label: 'Villain 3', value: 3 },
        { label: 'Villain 4', value: 4 },
        { label: 'Villain 5', value: 5 },
        { label: 'Villain 6', value: 6 },
        { label: 'Villain 7', value: 7 },
        { label: 'Villain 8', value: 8 },
    ]);

    const onCardNumOpen = useCallback(() => {
        setCardSuitOpen(false);
    }, []);
    

    const [cardNumOpen, setCardNumOpen] = useState(false);
    const [cardNumValue, setCardNumValue] = useState(null);
    const [cardNumItems, setCardNumItems] = useState([
        { label: 'Ace', value: 'Ace' },
        { label: 'King', value: 'King' },
        { label: 'Queen', value: 'Queen' },
        { label: 'Jack', value: 'Jack' },
        { label: 'Ten', value: 'Ten' },
        { label: 'Nine', value: 'Nine' },
        { label: 'Eight', value: 'Eight' },
        { label: 'Seven', value: 'Seven' },
        { label: 'Six', value: 'Six' },
        { label: 'Five', value: 'Five' },
        { label: 'Four', value: 'Four' },
        { label: 'Three', value: 'Three' },
        { label: 'Two', value: 'Two' },
    ])

    const onCardSuitOpen = useCallback(() => {
        setCardNumOpen(false);
    }, []);

    const [cardSuitOpen, setCardSuitOpen] = useState(false);
    const [cardSuitValue, setCardSuitValue] = useState(null);
    const [cardSuitItems, setCardSuitItems] = useState([
        { label: 'Spades', value: 'S' },
        { label: 'Clubs', value: 'C' },
        { label: 'Diamonds', value: 'D' },
        { label: 'Hearts', value: 'H' },
    ])

    


    React.useEffect(() => {
        setStyleCodes(updateStyle(dealerValue, activePlayer))
        setTextArray(updateText(dealerValue, activePlayer))
        setButtonArray(createPlayerArray())
        setBankrollArray(updateBankroll())
        setFlavorArray(createFlavorArray())
        setPosDispArray(createPosDispArray())
        console.log(posArray)
    
    }, [remountCount])

    React.useEffect(() => {
        if (highestBet != 0) {
            setBetMade(true);
        }

    }, [highestBet])


    //FUNCTION LIST--------------------------------------------------------------------------------------------------

    
    const resetEverything= () => {

        setProgress(0)
        setFlavorText(['                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            ', '                            '])
        setStyleCodes([0, 0, 0, 0, 0, 0, 0, 0, 0])
        setActiveCard('')
        setHoleCardActive(false)
        setBoardCardArray(['blank', 'blank', 'blank', 'blank','blank'])
        setHCArray(['blank', 'blank', 'blank', 'blank','blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank'])
        setActivePlayerOptions()
        setNameInput('')
        setDecideWinner(false)
        setWinnerInd(-1)
        setPot(0)
        setActivePlayer(0)
        setHighestBet(0)
        setMoneyPaid([0, 0, 0, 0, 0, 0, 0, 0, 0])
        setNumFolded(0)
        setBetMade(false)
        setResultsRecord(resultsRecord + actionRecord)
        setActionRecord('')
        setsbPosted(false)
        setbbPosted(false)
        
        //include a temp save file for the test string

        var temp = []
        for (let i = 0; i<players; i++) {
            temp.push(
                <TouchableOpacity style={styles.default} key={i} onPress={() => {
                    setActivePlayerOptions(i);
                    setHCModalVisible(!HCModalVisible)}}>
                    <Text style={styles.default}>
                        { "   Edit   "}
                    </Text>
                </TouchableOpacity>,
            )
    
        }
        setEditPButtonArray(temp);

        refresh()
    }

    const makeCardSelArray = (selected) => {
        var temp2 = []
        var temp3 = []
        var temp4 = []
        let cards = [' A ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 ', ' T ', ' J ', ' Q ', ' K ']
        let cardsFull = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King']
        for (let i = 0; i < 13; i++) {
            console.log("Loop start")


            if (i == 0) {
                if (i == selected) {
                    temp2.push(
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeCardSelArray(i)
                            setCardNumValue(cardsFull[i])                                   
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>  
                    )


                } else {
                    temp2.push(
                        <TouchableOpacity style={styles.cardOptionSt} key={i} onPress={() => { 
                            makeCardSelArray(i)  
                            setCardNumValue(cardsFull[i])                                     
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>  
                    )
                }

            }

            if (i > 0  &&  i < 7) {
                if (i == selected) {
                    temp3.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeCardSelArray(i)
                            setCardNumValue(cardsFull[i]) 
                                            
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                } else {
                    temp3.push(              
                        <TouchableOpacity style={styles.cardOptionSt} key={i} onPress={() => { 
                            makeCardSelArray(i)
                            setCardNumValue(cardsFull[i]) 
                                            
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

        
            }
            
            if (i > 6) {
                if (i == selected) {
                    temp4.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeCardSelArray(i)
                            setCardNumValue(cardsFull[i]) 
                                                
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>                 
                    )  

                } else {
                    temp4.push(              
                        <TouchableOpacity style={styles.cardOptionSt} key={i} onPress={() => { 
                            makeCardSelArray(i)
                            setCardNumValue(cardsFull[i]) 
                                                
                            }}>
                            <Text style={styles.cardSelectText}>{cards[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

            }

        }
        setCardSelButtonArray1(temp2)
        setCardSelButtonArray2(temp3)
        setCardSelButtonArray3(temp4)
        

    }

    const makeSuitSelArray = (selected) => {
        var temp = []
        let suits = [' Spades ', ' Clubs ', ' Diamonds ', ' Hearts ']
        let suitsCode = ['S', 'C', 'D', 'H']
        for (let i = 0; i < 4; i++) {
            if (i == 0) {
                if (i == selected) {
                    temp.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
    
                } else {
                    temp.push(              
                        <TouchableOpacity style={styles.spadeOption} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

            }

            if (i == 1) {
                if (i == selected) {
                    temp.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
    
                } else {
                    temp.push(              
                        <TouchableOpacity style={styles.clubOption} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

            }

            if (i == 2) {
                if (i == selected) {
                    temp.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
    
                } else {
                    temp.push(              
                        <TouchableOpacity style={styles.diamondOption} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

            }

            if (i == 3) {
                if (i == selected) {
                    temp.push(              
                        <TouchableOpacity style={styles.cardSelectSt} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
    
                } else {
                    temp.push(              
                        <TouchableOpacity style={styles.heartOption} key={i} onPress={() => { 
                            makeSuitSelArray(i)
                            setCardSuitValue(suitsCode[i])
                                                
                            }}>
                            <Text style={styles.basicButtonText}>{suits[i]}</Text>
                        </TouchableOpacity>                 
                    )  
                }

            }



        }

        setSuitSelButtonArray(temp)

    }


    const getPositions = () => {
        
        let posBank = []

        if (players == 9) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ', ' UTG+1 ', ' MP ', ' MP+1 ', ' HJ ', ' CO ']
        } else if (players == 8) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ', ' MP ', ' MP+1 ', ' HJ ', ' CO ']
        } else if (players == 7) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ', ' MP ', ' HJ ', ' CO ']
        } else if (players == 6) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ', ' MP ', ' CO ']
        } else if (players == 5) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ', ' CO ']
        } else if (players == 4) {
            posBank = [' DE ' , ' SB ', ' BB ', ' UTG ']
        } else if (players == 3) {
            posBank = [' DE ' , ' SB ', ' BB ']
        } else if (players == 2) {
            posBank = [' DE/SB ' , ' BB ']
        }



        let temp = []
        let ind = 0


        for(let i = 0; i < posBank.length; i++) {
            //will build the Array based on the realtionship between the player and the dealerValue

            ind = posBank.length - dealerValue + i

            if (ind >= posBank.length) {
                ind = ind - posBank.length
            }

            temp.push(posBank[ind])

        }

        setPosArray(temp)

        

        let tempRec = ''

        for (let i = 0; i < players; i++) {
            tempRec = tempRec + namesArray[i] + "(" + temp[i] + ") $" + bankroll[i] + " /n "
            
        }


        return tempRec

    }


    const nextStage = () => {
        var p = progress + 1


        if (p == 2) {
            setPreflopRecord(preflopRecord + actionRecord);
            setPreflopPot(pot.toFixed(2));
        }

        if (p == 3) {
            setFlopRecord(flopRecord + actionRecord);
            setFlopPot(pot.toFixed(2))

        }

        if (p == 4) {
            setTurnRecord(turnRecord + actionRecord);
            setTurnPot(pot.toFixed(2))
        }

        if (p == 5) {
            setRiverRecord(riverRecord + actionRecord);
            setRiverPot(pot.toFixed(2))

        }


        if (progress == 4) {

            setEditPButtonArray(createWinnerArray())
            setDecideWinner(true)
            
        }

        setActivePlayer(nextPlayer(dealerValue))
        setCloseActionInd(nextPlayer(dealerValue))
        setMoneyPaid([0, 0, 0, 0, 0, 0, 0, 0, 0])

        setHighestBet(0)
        setBetMade(false)
        setProgress(progress + 1)
        refresh()

    };


    const initializeButtonArray = () => {
        var temp = []
        
        for (let i=0; i< players; i++) {

            temp.push(<Text style={styles.default} key={i}>{textArray[i]}</Text>)
        }


        return temp

    }

    const updateStyle = (d, ap) => {
        let tempStyle = styleCodes

        let sb = d + 1
        let bb = d + 2

        if (sb > players - 1) {
            sb = sb - players
        }

        if (bb > players - 1) {
            bb = bb - players
        }

     
        if (ap > players - 1) {
            ap = ap - players
        }


        for (i=0; i < tempStyle.length; i++) {
            if (progress > 0) {
                if (tempStyle[i] != 5) {
                    if (i == d) {
                        tempStyle[i] = 1
                    } else if (i == sb) {
                        tempStyle[i] = 2
                    } else if (i == bb) {
                        tempStyle[i] = 3
                    }  else {
                        tempStyle[i] = 0
                    }

                    if (i == ap) {
                        tempStyle[i] = 4
                    }
                }
            }
        }

        return tempStyle

    }

    const updateText = (d, ap) => {
        let tempText = textArray

        let sb = d + 1
        let bb = d + 2

        if (sb > players - 1) {
            sb = sb - players
        }

        if (bb > players - 1) {
            bb = bb - players
        }

     
        if (ap > players - 1) {
            ap = ap - players
        }


        for (i=0; i < tempText.length; i++) {
            if (progress > 0) {
                if (tempText[i] != 5) {
                    if (i == d) {
                        tempText[i] = namesArray[i] //+ '- dealer' + flavorText[i]
                    } else if (i == sb) {
                        tempText[i] = namesArray[i] //+ '- small blind' + flavorText[i]
                    } else if (i == bb) {
                        tempText[i] = namesArray[i] //+ '- big blind ' + flavorText[i]
                    } else {
                        tempText[i] = namesArray[i] //+ flavorText[i]
                    }

                    if (i == ap) {
                        tempText[i] = namesArray[i] //+ '- active player' + flavorText[i]
                    }
                }
            }
        }

        return tempText

    }

    const createPlayerArray = () => {
        var temp = []

        for (let i=0; i < players; i++) {

            if (styleCodes[i] < 4) {
                temp.push(<Text style={styles.default} key={i}>{textArray[i]}</Text>)

            }

            // if (styleCodes[i] == 1) {
            //     temp.push(<Text style={styles.dealer} key={i}>{textArray[i]}</Text>)

            // }

            // if (styleCodes[i] == 2) {
            //     temp.push(<Text style={styles.blinds} key={i}>{textArray[i]}</Text>)

            // }

            // if (styleCodes[i] == 3) {
            //     temp.push(<Text style={styles.blinds} key={i}>{textArray[i]}</Text>)

            // }

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

        for (let i=0; i < players; i++) {
            if (i == activePlayer) {
                temp.push(<Text style={styles.activeFlavor} key={i}>{flavorText[i]}</Text>)
            } else {
                temp.push(<Text style={styles.default} key={i}>{flavorText[i]}</Text>)
            }
            
        }

        return temp

    }

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

    const createWinnerArray = () => {

        var temp = []
        for (let i = 0; i<players; i++) {
            temp.push(
                <TouchableOpacity style={styles.editButton} key={i} onPress={() => {
                    setActivePlayerOptions(i);
                    setHCModalVisible(!HCModalVisible)}}>
                    <Text style={styles.editButtonText}>
                        {"   Wins   "}
                    </Text>
                </TouchableOpacity>,
            )
    
        }
        return temp

    }

    const updateBankroll = () => {
        let temp = []

        for (let i=0; i < players; i++) {
            if (progress > 0) {
                if (i == activePlayer) {
                    temp.push(<Text style={styles.activeBankRoll} key = {i}> {'$' + bankroll[i] + ' '}</Text>)
                } else {
                    temp.push(<Text style={styles.default} key = {i}> {'$' + bankroll[i] + ' '}</Text>)
                }
              
            }
        }

        return temp
    }

    const dropdownOrCards = (p) => {
        let temp = []



        if (p == 0) {
            if (players == 2) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems2m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems2m}
                />)
            } else if(players == 3) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems3m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems3m}
                />)
            } else if(players == 4) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems4m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems4m}
                />)
            } else if(players == 5) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems5m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems5m}
                />)
            } else if(players == 6) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems6m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems6m}
                />)
            } else if(players == 7) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems7m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems7m}
                />)
            } else if(players == 8) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems8m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems8m}
                />)
            } else if(players == 9) {
                return  (<DropDownPicker
                    zindex={1}
                    open={dealerOpen}
                    value={dealerValue}
                    items={dealerItems9m}
                    setOpen={setDealerOpen}
                    setValue={setDealerValue}
                    setItems={setDealerItems9m}
                />)
            }

        }

        if (p > 1) {
            for (let i=0; i<(p+1); i++) {

                if (i != 5) {
                    temp.push( 
                        <TouchableOpacity key={i} onPress={() => {
                            setHoleCardActive(false)
                            setActiveCard(i);
                            setModalVisible(!modalVisible)}}>
                            <View>
                                <Image source={imageMap[boardCardArray[i]]}  style={styles.img}/>
                            </View>
                        </TouchableOpacity>
                    )
                }
            }

            return temp
        }


    }

    const nextPlayer = (cp) => {

        let found = 0
        let count = 0

        let rec = namesArray[activePlayer] + flavorText[activePlayer] + '/n'

        setActionRecord(actionRecord + rec)
        
        while(found == 0) {
            
            cp = cp + 1
            count = count + 1 


            if (cp > players - 1) {
                cp = 0
            }
            if (styleCodes[cp] != 5) {
                found = 1
                if (closeActionInd == cp ) {
                     
                    //setFlavorText(['', '', '', '', '', '', '', '', ''])
                 }
                return cp
            }

        }
        
    }

    const madeABet = (b) => {

        if (activePlayer != closeActionInd || justStarted == true) {

            if (b > 0) {
                let bankTemp = bankroll
                let payments = moneyPaid

                let netBet = b + highestBet
                let raised = false
                let amtRaised = 0

                if (netBet > b) {
                    raised = true
                    amtRaised = b
                }


                let money2Pay = netBet - parseFloat(payments[activePlayer])

                payments[activePlayer] = netBet
                bankTemp[activePlayer] = (parseFloat(bankTemp[activePlayer]) - money2Pay).toFixed(2)

                setMoneyPaid(payments)
                setHighestBet(netBet)
                
                
                setPot(pot + money2Pay)
                
                setBankroll(bankTemp)

                setBetMade(true)

                
                let temp = flavorText

                if (raised == true) {
                    temp[activePlayer] = ' Raised $' + amtRaised.toFixed(2) + ' '
                } else {
                    temp[activePlayer] = ' Bet $' + b.toFixed(2) + ' '
                }

                
                setFlavorText(temp)

                setJustStarted(false)



                setCloseActionInd(activePlayer)
                setNewBet('')
                setActivePlayer(nextPlayer(activePlayer))
                
            }
        }
    }

    const check = () => {

        if (activePlayer != closeActionInd || justStarted == true) {

            let temp = flavorText
            temp[activePlayer] = '        Check        '
            setFlavorText(temp)

            setJustStarted(false)

            
            
            setActivePlayer(nextPlayer(activePlayer))
        }
        
    }

    const call = () => {

        if (activePlayer != closeActionInd || justStarted == true) {

        
            let bankTemp = bankroll
            let payments = moneyPaid

            let netMoney2Pay = parseFloat(highestBet) - parseFloat(payments[activePlayer])

            bankTemp[activePlayer] = (parseFloat(bankTemp[activePlayer]) - netMoney2Pay).toFixed(2)
            setBankroll(bankTemp)

            payments[activePlayer] = highestBet

            setMoneyPaid(payments)

            setPot(pot + parseFloat(netMoney2Pay))
            let temp = flavorText
            temp[activePlayer] = ' Called $' + parseFloat(netMoney2Pay).toFixed(2) + ' '
            setFlavorText(temp)

            setJustStarted(false)

            if (progress == 1 && posArray[activePlayer] == 'SB' && posArray[closeActionInd] == 'BB') {
                setCloseActionInd(closeActionInd + 1)
                setBetMade(false)
            }
            refresh()

            setActivePlayer(nextPlayer(activePlayer))

        }

    }

    const fold = () => {

        if (activePlayer != closeActionInd || justStarted == true) {

            let temp = flavorText
            temp[activePlayer] = ' Fold '
            setNumFolded(numFolded + 1)

            
            setFlavorText(temp)

            setRealTimePlayers(realTimePlayers - 1)

            let temp2 = styleCodes
            temp2[activePlayer] = 5
            setStyleCodes(temp2)

            let bankTemp = bankroll

            

            if (players - numFolded == 2) {

                setMoneyWon(pot.toFixed(2))
                

                setWinnerInd(nextPlayer(activePlayer))
                setR(namesArray[nextPlayer(activePlayer)] + ' Wins $' + pot.toFixed(2) + '/n')

                bankTemp[nextPlayer(activePlayer)] = (parseFloat(bankTemp[nextPlayer(activePlayer)]) + pot).toFixed(2)
                setBankroll(bankTemp)
                setPot(0)

            }

            setJustStarted(false)

    
            setActivePlayer(nextPlayer(activePlayer))
        }
 

    }

    const getCardPicker = () => {

        return (
            //Put in the modal here
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}
                >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}> 
                        <View style={styles.rowModal}>
                            {cardSelButtonArray1}
                        </View>

                        <View style={styles.rowModal}>
                            {cardSelButtonArray2}  
                        </View> 

                        <View style={styles.rowModal}>
                            {cardSelButtonArray3}
                        </View>

                        <Text></Text>

                        <View style={styles.rowModal}>
                            {suitSelButtonArray}
                        </View>

                        <Text></Text>
                        <Text></Text>
                                              

                        <View style={styles.rowModal}>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {

                                    let temp = []
                                    if (holeCardActive == true) {
                                        temp = HCArray
                                        if (cardNumValue == null || cardSuitValue == null) {
                                            temp[activeCard] = 'blank'
                                        } else {
                                            temp[activeCard] = cardNumValue + cardSuitValue

                                        }
                                        
                                        setHCArray(temp)
                                        setModalVisible(!modalVisible)

                                    } else {
                                        temp = boardCardArray

                                        if (cardNumValue == null || cardSuitValue == null) {
                                            temp[activeCard] = 'blank'
                                        } else {
                                            temp[activeCard] = cardNumValue + cardSuitValue

                                        }
                                        
                                        setBoardCardArray(temp)
                                        setModalVisible(!modalVisible)
                                    }
                                    
                                    //Resets the values for the next selection 
                                    setCardNumValue()
                                    setCardSuitValue()

                                }}
                                >
                                <Text style={styles.textStyle}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                }}
                                >
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                </View>
            </Modal>
        )
        
    }


    const getPlayerAttributes = (p) => {
        let bankTemp = bankroll

        return (
            //Put in the modal here
            <Modal
                animationType="slide"
                transparent={true}
                visible={HCModalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setHCModalVisible(false);
                }}
                >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            defaultValue={namesArray[p]}
                            onChangeText = {setNameInput}
                            
                            //placeholder={"Enter name here (optional)"}
                        />

                        <TextInput
                            keyboardType = 'numeric'
                            onChangeText = {setChangeBankroll}
                            value={changeBankroll.toString()}
                            placeholder={"Change Player's Bankroll"}
                        />

                        <View style={styles.rowModal}>

                            <TouchableOpacity onPress={() => {
                                setHoleCardActive(true)
                                setActiveCard(2*p);
                                setModalVisible(!modalVisible)
                                makeCardSelArray(-1)
                                makeSuitSelArray(-1)}}>
                                <View>
                                    <Image source={imageMap[HCArray[2*p]]}  style={styles.img}/>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                setHoleCardActive(true)
                                setActiveCard(2*p + 1);
                                setModalVisible(!modalVisible)
                                makeCardSelArray(-1)
                                makeSuitSelArray(-1)}}>
                                <View>
                                    <Image source={imageMap[HCArray[2*p + 1]]}  style={styles.img}/>
                                </View>
                            </TouchableOpacity>


                        </View>

                        <TextInput
                            onChangeText={setRecentNote}
                            style={styles.input}
                            //value={recentNote.toString()}
                            defaultValue={playerNotesArray[p]}
                            //autoComplete={autoComplete}
                            //autoCapitalize={autoCapitalize}
                            placeholder={"Enter Player Notes Here"}
                            //secureTextEntry={secureTextEntry}
                            //keyboardType={keyboardType}
                            //returnKeyType={returnKeyType}
                            //autoFocus={autoFocus}
                            
                            //onSubmitEditing={onSubmitEditing}
                            multiline={true}
                            numberOfLines={3}
                            //ref={(r) => { inputRef && inputRef(r); }}
                        />

                        <View style={styles.rowModal}>

                    
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {

                                    let noteTemp = playerNotesArray

                                    noteTemp[p] = recentNote
                                    setPlayerNotesArray(noteTemp)
                                    setRecentNote('')

                                    let bankTemp = bankroll

                                    if (changeBankroll != '') {
                                        bankTemp[p] = parseFloat(changeBankroll).toFixed(2)
                                        setBankroll(bankTemp)

                                        setChangeBankroll('')
                                    }                                

                                    let temp = namesArray

                                    if (nameInput.toString() != '') {
                                        temp[p] = nameInput
                                        setNamesArray(temp);
                                        setNameInput('')
                                    }

                                    if (decideWinner == true) {
                                        setWinnerInd(p)
                                        
                                        bankTemp[p] = (parseFloat(bankTemp[p]) + pot).toFixed(2)
                                        setBankroll(bankTemp)
                                        setR(namesArray[p] + ' Wins $' + pot.toFixed(2) + '/n')
                                        setPot(0)
                                    }
                                    setHCModalVisible(!HCModalVisible);
                                    refresh();
                                }}
                                >
                                <Text style={styles.textStyle}>{"Confirm"}</Text>
                            </TouchableOpacity>

                            
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setHCModalVisible(false);
                                    setModalVisible(false);
                                }}
                                >
                                <Text style={styles.textStyle}>{"Cancel"}</Text>
                            </TouchableOpacity>

                        </View>

                        


                    </View>
                </View>
            </Modal>
        )
    }

    const removePlayerAndReset = (p) => {
        if (players + p <= NP) {
            setPlayers(players + p)
            resetEverything()
        }   
        
    }

    const storeHand = () => {

        var flopBoard = 'BOARD: [' + boardCardArray[0] + ' / ' +  boardCardArray[1] + ' / ' + boardCardArray[2] + ']/n'
        var turnBoard = 'BOARD: [' + boardCardArray[0] + ' / ' + boardCardArray[1] + ' / ' + boardCardArray[2] + ' / ' + boardCardArray[3] + ']/n'
        var riverBoard = 'BOARD: [' + boardCardArray[0] + ' / ' + boardCardArray[1] + ' / ' + boardCardArray[2] + ' / '  + boardCardArray[3] + ' / ' + boardCardArray[4] + ']/n'
        var holeCards = 'HOLE CARDS: [' + HCArray[0] + ' / ' + HCArray[1] + ']/n'

        var fPot = 'POT: $' + flopPot + '/n'
        var tPot = 'POT: $' + turnPot + '/n'
        var rPot = 'POT: $' + riverPot + '/n'

        record.push(("Hand #" + handNum + "/n" + playerRecord + '*** PREFLOP ***/n' + holeCards + preflopRecord + '*** FLOP ***/n' + fPot  + flopBoard + flopRecord + '*** TURN ***/n' + tPot + turnBoard + turnRecord + '*** RIVER ***/n' + rPot + riverBoard + riverRecord + '*** RESULTS ***/n' + r + '/n'))

        //console.log(record)

        handNum = handNum + 1

        setPreflopRecord('');
        setFlopRecord('');
        setTurnRecord('');
        setRiverRecord('')
        setR('')

    }


    const saveRecord = () => {
        var fileContents = "Session: " + currentDate + " " + currentTime + "/ Hand #" + handNum + "/n"

        for (let i = 0; i < record.length; i++) {
            fileContents = fileContents + record[i]
        }

        storeData(fileContents)

        console.log(fileContents)
        getAllKeys()
    }

    const saveFileOptions = () => {
        return (
            //Put in the modal here
            <Modal
                animationType="slide"
                transparent={true}
                visible={fileModalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setFileModalVisible(false);
                }}
                >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Please name your session</Text>

                        <TextInput
                            defaultValue= "My Game"
                            onChangeText = {setFileNameInput}

                        />




                        <View style={styles.rowModal}>

                    
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    saveRecord();
                                    setFileModalVisible(!fileModalVisible);
                                    refresh();
                                }}
                                >
                                <Text style={styles.textStyle}>{"Save"}</Text>
                            </TouchableOpacity>

                            
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => {
                                    setFileModalVisible(false);
                                }}
                                >
                                <Text style={styles.textStyle}>{"Cancel"}</Text>
                            </TouchableOpacity>

                        </View>

                        


                    </View>
                </View>
            </Modal>
        )

    }

    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem(fileNameInput + '_' + currentDate + '_' + currentTime, value)
        } catch (e) {
          // saving error
        }
    }

    

    getAllKeys = async () => {
        let keys = []
        try {
          keys = await AsyncStorage.getAllKeys()
        } catch(e) {
          // read key error
        }
      
        console.log(keys)
        // example console.log result:
        // ['@MyApp_user', '@MyApp_key']
    }





    //RETURN STATEMENT---------------------------------------------------------------------------------------------------

    return (

        

        
        <ImageBackground style={ styles.imgBackground } 
            resizeMode='cover' 
            source={require('../pictures/Backgrounds/placeholder.jpg')}>

            {modalVisible && 
                getCardPicker()
            }

            {HCModalVisible &&
                getPlayerAttributes(activePlayerOptions)
            }

            {fileModalVisible &&
                saveFileOptions()
            }

            {progress > 0 &&
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
                        <Text style={styles.stageStyle}>{"Stage: "}{stage[progress]}</Text>
                    </View>
                </View>
            } 

            <View style={styles.midSegment}>
                      


                <View style={styles.row}>
                    {dropdownOrCards(progress)}
                </View>


                {progress == 0 &&

                    <View style={styles.row}>

                        <TouchableOpacity style={styles.basicButton} onPress={() => { 
                            
                            setActivePlayer(dealerValue + 1);
                            setCloseActionInd(dealerValue + 1);
                            setJustStarted(true);
                            setPlayerRecord(getPositions());
                            nextStage();

                            //Brings up the hole card selection modal for player 1
                            setActivePlayerOptions(0);
                            setHCModalVisible(!HCModalVisible) 
                            refresh();
                            }}>
                            <Text style={styles.basicButtonText}>Start Hand</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.basicButton} onPress={() => { initializeButtonArray() }}>
                            <Text style={styles.basicButtonText}>Reset Array</Text>
                        </TouchableOpacity>


                    </View>

                }

                
                {activePlayer == closeActionInd && justStarted == false &&

                    <TouchableOpacity style={styles.basicButton} onPress={() => { 
                        let temp = flavorText
                        for (let i = 0; i < players; i++) {
                            if (flavorText[i] == ' Fold ') {
                                temp[i] = flavorText[i]
                            } else {
                                temp[i] = '                            '
                            }
                        }

                        setFlavorText(temp)
                        setCloseActionInd(dealerValue + 1)
                        nextStage();
                        setJustStarted(true);
                        setActionRecord('');
                        refresh();
                    }}>
                        <Text style={styles.basicButtonText}>{'Go to ' + stage[progress + 1]}</Text>
                    </TouchableOpacity>
                    
                    
                }  

                {progress == 1 && sbPosted == false &&

                    <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                                
                        madeABet(smallBlind);
                        setsbPosted(true);
                        refresh();
                    }}>
                        <Text style={styles.basicButtonText}>Post Small Blind</Text>
                    </TouchableOpacity>
                }

                {progress == 1 && sbPosted == true && bbPosted == false &&

                    <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                                                
                        madeABet(smallBlind);
                        setbbPosted(true);
                        refresh();
                    }}>
                        <Text style={styles.basicButtonText}>Post Big Blind</Text>
                    </TouchableOpacity>
                    
                }

            

                {progress > 0 && progress < 5 && (players - numFolded > 1) && 

                
                    <View style={styles.row}>

                        <TextInput
                            keyboardType = 'numeric'
                            onChangeText = {setNewBet}
                            value={newBet.toString()}
                            placeholder={"Input Bet Here"}
                        />

                        <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                if ((parseFloat(newBet) + parseFloat(highestBet)) <= parseFloat(bankroll[activePlayer])) {
                                    madeABet(parseFloat(newBet), activePlayer);
                                    refresh();
                                }else {
                                    console.log('Bet Too high!')
                                    console.log('new Bet', newBet)
                                    console.log('highestBet', highestBet)
                                    console.log('bankroll', bankroll[activePlayer])
                                }
                            }}>
                            <Text style={styles.basicButtonText}>Bet/Raise</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                
                            if (betMade == false) {
            
                                check();

                                refresh();
                                
                            } else {
                                setR(namesArray[activePlayer] + 'Called $' + highestBet.toFixed(2) + '/n')

                                call();

                                refresh();
                            }
                            }}>
                            <Text style={styles.basicButtonText}>Check/Call</Text>
                        </TouchableOpacity> 

                        <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                
                                setR(namesArray[activePlayer] + 'Folded' + '/n');

                                fold();
        
                                refresh();
                            }}>
                            <Text style={styles.basicButtonText}>Fold</Text>
                        </TouchableOpacity>                   


                    </View>

                
                }


                {winnerInd >= 0 &&

                    <View>

                        
                        <Text>The winner is {namesArray[winnerInd]}</Text>

                        <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                

                                storeHand()
                                resetEverything()
                            }}>
                            <Text style={styles.basicButtonText}>New Hand</Text>
                        </TouchableOpacity>  


                    </View>

                }

                

                {(progress == 5) && winnerInd < 0 &&

                    <>            
                        <View>
                            <Text>Who won the hand?</Text>

                                
                            <TouchableOpacity style={styles.basicButton} onPress={() => { 
                                                    

                                storeHand()
                                resetEverything()

                                }}>
                                <Text style={styles.basicButtonText}>New Hand</Text>
                            </TouchableOpacity>  

                        </View>
                    </>

                }
            </View>

            <View style={styles.botSegment}>


                <View style={styles.row}>

                    <View>

                        
                        <TouchableOpacity style={styles.basicButton} onPress={() => {removePlayerAndReset(1)}}>
                            <Text style={styles.basicButtonText}>Add Player</Text>
                        </TouchableOpacity>  

                        <TouchableOpacity style={styles.basicButton} onPress={() => {removePlayerAndReset(-1)}}>
                            <Text style={styles.basicButtonText}>Remove Player</Text>
                        </TouchableOpacity>  

                        <TouchableOpacity style={styles.basicButton} onPress={() => {resetEverything()}}>
                            <Text style={styles.basicButtonText}>Reset Hand</Text>
                        </TouchableOpacity>  

                    </View>

                    <View>

                        <TouchableOpacity style={styles.basicButton} onPress={() => navigation.push('HistoryScreen')}>
                            <Text style={styles.basicButtonText}>History Screen</Text>
                        </TouchableOpacity>  

                        <TouchableOpacity style={styles.basicButton} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.basicButtonText}>Go To Home</Text>
                        </TouchableOpacity>  

                        
                        <TouchableOpacity style={styles.basicButton} onPress={() => setFileModalVisible(true)}>
                            <Text style={styles.basicButtonText}>Save Hand Record</Text>
                        </TouchableOpacity> 

                    </View>

                </View>

            </View>
        </ImageBackground>
        
        


    );



}


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


