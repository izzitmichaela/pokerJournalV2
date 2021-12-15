import * as React from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { useState } from "react";
import Modal from 'react-native-modal';
//import { useTable } from 'react-table'
import styled from 'styled-components'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';








export default function HistoryScreen( {navigation} ){
  const [modalVisible, setModalVisible] = useState(false);
  const [keyTotal, setKeyTotal] = useState([])
  const [editID, setEditID] = useState(-1)
  const [tableUpdated, setTableUpdated] = useState(false)
  const [totalData, setTotalData] = useState([])
  const [remountCount, setRemountCount] = useState(0)
  const [currentSelection, setCurrentSelection] = useState('Please select a game to view record')
  const [formattedeSelection, setFormattedSelection] = useState([]);
  const [testVariable, setTestVariable] = useState('This is a test /n second line')
  const [rawRecord, setRawRecord] = useState('')

  React.useEffect(() => {
    
    getAllKeys()


  }, [remountCount])

  const refresh = () => {
    setRemountCount(remountCount + 1)
    setTableUpdated(true)
  }

  getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
      setKeyTotal(keys)

      var temp = []
      var butCol
      var dateCol
      var nameCol
  
      for (let i = 0; i < keys.length; i++) {
        //masterString = getData(keyTotal[i])
        pieces = keys[i].split('_')
        nameCol = pieces[0]
  
        dateCol = pieces[1]
    
    
        butCol = 
        <TouchableOpacity onPress = {() => {
          setEditID(i)
          getData(keys[i])
          refresh()
          //setCurrentSelection()
        }}>
    
          <Text> Select </Text>
        </TouchableOpacity>
    
        temp.push([nameCol, dateCol, butCol])
      
      }

      console.log('Table Updated')
      //console.log('Temp',temp)
      setTableUpdated(true)
      setTotalData(temp)

    } catch(e) {
      // read key error
    }

    
    console.log('Keys',keys)
    //refresh()
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }

  removeValue = async (keyID) => {
    try {
      await AsyncStorage.removeItem(keyID)
      console.log('Success')
    } catch(e) {
      // remove error
    }
  
    console.log('Done.')
  }




  const [tableHead, setTableHead] = useState(['Name', 'Date', 'Edit']);
  //const [tableData, setTableData] = useState(totalData)



  getData = async (item) => {
      try {
        const value = await AsyncStorage.getItem(item)

        if(value !== null) {
          // means it has grabbed the value previously stored

          let lines = value.split('/n')
          let output = [<Text key = {-1}>Game Record</Text>]
          setRawRecord(value)
      
          for (i =0; i<lines.length; i++) {
            output.push(<Text key = {i}>{lines[i]}</Text>)
      
          }
          console.log(output)

          
      
          setFormattedSelection(output)

        }
    } catch(e) {
      // error reading value
    }

      
  }

  const showEditModal = () => {

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
               <Text>Are you sure?</Text>

              <TouchableOpacity style={styles.basicButton} onPress = {() => {
                  console.log('key2del', keyTotal[editID])
                  removeValue(keyTotal[editID])

                  setEditID(-1)
                  refresh()
                  setModalVisible(!modalVisible)
                }}>
    
                <Text style={styles.basicButtonText}> Yes, Delete </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.basicButton} onPress = {() => {
                setModalVisible(!modalVisible)
                }}>
    
                <Text style={styles.basicButtonText}> Cancel </Text>
              </TouchableOpacity>

            </View>
              
          </View>
      </Modal>
    )

  }


  return (

    <View style={styles.container}>

      {modalVisible && 
        showEditModal()
      }

      {tableUpdated == false &&
        refresh()
      }


      {tableUpdated == true &&
        <Table>
          <Row data={tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <ScrollView style={styles.dataWrapper}>
              <TableWrapper style={styles.wrapper}>
                <Col style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                <Rows data={totalData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/>
              </TableWrapper>
          </ScrollView>
        </Table>
      }

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroller}>

          {formattedeSelection}

        </ScrollView>
      </SafeAreaView>

      <View style={styles.butRow}>
        <TouchableOpacity style={styles.basicButton} onPress={() => {

          navigation.navigate('SimulatorScreen', {
            record: rawRecord
          });

         }}>
         <Text style={styles.basicButtonText}>Simulate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.basicButton} onPress={() => {
          setModalVisible(!modalVisible)
          }}>
          <Text style={styles.basicButtonText}>Delete</Text>
        </TouchableOpacity>

      </View>


      <Button
          title="Go to Session Screen"
          onPress={() => navigation.push('SessionScreen')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: {  height: 40,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: {  height: 28  },
  text: { textAlign: 'center' },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  butRow: {
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: 'space-between',
    justifyContent: 'center'
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

  dataWrapper: { marginTop: -1 },

  container: {
    flex: 0.8,
  },

  scroller: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
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
});