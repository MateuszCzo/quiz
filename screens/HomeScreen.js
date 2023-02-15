import { StyleSheet, Text, Button } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import shuffle from 'lodash.shuffle';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({route, navigation}) {

  //fetching tests from AsyncStorage
  const [tests, setTests] = useState([]);
  useEffect(() => {
    load("tests", setTests);
  }, [])

  //fetching tests from AsyncStorage on Button click
  const {fetchDataFromSerwer} = route.params;
  const fetchData = () => {
    fetchDataFromSerwer();
    load("tests", setTests);
  }

  const load = async(name, fncName) => {
    try {
      let use = await AsyncStorage.getItem(name);
      if (use !== null) {
        fncName(JSON.parse(use));
      }
    } catch (err) {
      alert(err);
    }
  };

  //creating TouchableOpacity for each test
  const testsItems = shuffle(tests.map((item, i) => {
    return (
      <TouchableOpacity key={i} style={styles.card} onPress={() => navigation.navigate(item.name, item.id)}>
        <Text style={styles.Roboto}>{item.name}</Text>
        <Text style={styles.Rubik}>{item.description}</Text>
      </TouchableOpacity>
    )
  }))

  //opening random test
  const randomTest = () => {
    navigation.navigate(tests[Math.floor(Math.random() * (tests.length-1))].name)
  }

  //fonts
  let [fontsLoaded] = useFonts({
    'Roboto-Black': require('.././assets/fonts/Roboto-Black.ttf'),
    'RubikGemstones-Regular': require('.././assets/fonts/RubikGemstones-Regular.ttf'),
  })

  return (
    fontsLoaded &&
    <ScrollView>
      <TouchableOpacity onPress={randomTest}><Text>Random Test</Text></TouchableOpacity>
      <TouchableOpacity onPress={fetchData}><Text>Refresh Tests</Text></TouchableOpacity>
      {testsItems}
      <Text style={styles.heading}>Get to know your ranking result</Text>
      <Button style={styles.button} onPress={() => navigation.navigate('Results')} title="Check"></Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  questions: {
    padding: 15,
  },
  card: {
    textAlign: 'center',
    margin: 15,
    padding: 15,
    borderWidth: 1,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonTitle: {
    textAlign: 'center',
  },
  button: {
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 20,
    paddingEnd: 20,
    backgroundColor: '#222222'
  },
  Roboto: {
    fontFamily: 'Roboto-Black'
  },
  Rubik: {
    fontFamily: 'RubikGemstones-Regular'
  }
});