import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useFonts } from 'expo-font';
import { StyleSheet, RefreshControl, ScrollView, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Results() {

  //fetching results from AsyncStorage
  const [data, setData] = useState([]);
  useEffect(() => {
    loadResults();
  }, [])

  const loadResults = async() => {
    const result = await AsyncStorage.getItem("results");
    setData(JSON.parse(result))
  };

  //fonts
  let [fontsLoaded] = useFonts({
    'Roboto-Black': require('.././assets/fonts/Roboto-Black.ttf'),
    'RubikGemstones-Regular': require('.././assets/fonts/RubikGemstones-Regular.ttf'),
  })

  //refreshing using RefreshControl
  const [refresh, setRefresh] = useState(false);
  const pullMe = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 3000);
  }

  //creating table from fetched data
  const tableRows = data.map((row, i) => {
     return (
      <DataTable.Row key={i}>
        <DataTable.Cell><Text style={styles.Roboto}>{row.nick}</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.Roboto}>{row.score}</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.Roboto}>{row.total}</Text></DataTable.Cell>
        <DataTable.Cell><Text style={styles.Roboto}>{row.type}</Text></DataTable.Cell>
        <DataTable.Cell style={styles.lastRow}><Text style={styles.Roboto}>{row.createdOn}</Text></DataTable.Cell>
      </DataTable.Row>
     )
  })
  const table = (
    <DataTable style={styles.container}>
      <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title><Text style={styles.Rubik}>Nick</Text></DataTable.Title>
        <DataTable.Title><Text style={styles.Rubik}>Score</Text></DataTable.Title>
        <DataTable.Title><Text style={styles.Rubik}>Total</Text></DataTable.Title>
        <DataTable.Title><Text style={styles.Rubik}>Type</Text></DataTable.Title>
        <DataTable.Title><Text style={styles.Rubik}>Date</Text></DataTable.Title>
      </DataTable.Header>
      {tableRows}
    </DataTable>
  )

  return (
    fontsLoaded &&
    <View style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => pullMe()}/>}>
        {table}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  lastRow: {
    minWidth: 30,
  },
  Roboto: {
    fontFamily: 'Roboto-Black'
  },
  Rubik: {
    fontFamily: 'RubikGemstones-Regular'
  }
});