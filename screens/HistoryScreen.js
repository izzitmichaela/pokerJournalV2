import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, Button, TouchableOpacity } from 'react-native';
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

  React.useEffect(() => {
    
    getAllKeys()
    updateTable()


  }, [remountCount])

  const refresh = () => {
    setRemountCount(remountCount + 1)
    setTableUpdated(true)
  }

  getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()

    } catch(e) {
      // read key error
    }

    setKeyTotal(keys)
    console.log(keys)
    refresh()
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


  const updateTable = () => {
    var temp = []
    var butCol
    var dateCol
    var nameCol

    for (let i = 0; i < keyTotal.length; i++) {
      //masterString = getData(keyTotal[i])
      pieces = keyTotal[i].split('_')
      nameCol = pieces[0]

      dateCol = pieces[1]
  
  
      butCol = 
      <TouchableOpacity onPress = {() => {
        setEditID(i)
        setModalVisible(!modalVisible)
      }}>
  
        <Text> Select </Text>
      </TouchableOpacity>
  
      temp.push([nameCol, dateCol, butCol])
    
    }
    console.log('Table Updated')
    console.log(temp)
    setTableUpdated(true)
    setTotalData(temp)

    return (<Text>Please Wait</Text>)

  
  }



  const [tableHead, setTableHead] = useState(['Name', 'Date', 'Edit']);
  //const [tableData, setTableData] = useState(totalData)



  const getData = async (item) => {
      try {
        const value = await AsyncStorage.getItem(item)
        if(value !== null) {
          // value previously stored
          console.log(value)
          return value
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
              <Text>Test</Text>

              <TouchableOpacity onPress = {() => {
                console.log(totalData[editID][0])
                  removeValue(totalData[editID][0])

                  setEditID(-1)
                  refresh()
                  setModalVisible(!modalVisible)
                }}>
    
                <Text> Delete </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress = {() => {
                setModalVisible(!modalVisible)
                }}>
    
                <Text> Cancel </Text>
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


      <Text>History Screen</Text>
      <Button title="Get keys" onPress={() => console.log(tableData)} />
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
});