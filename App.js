import { useEffect, useState } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import shuffle from 'lodash.shuffle';
import NetInfo from '@react-native-community/netinfo';

import HomeScreen from "./screens/HomeScreen";
import Results from "./screens/Results";
import Tests from "./screens/Tests"
import WelcomeScreen from "./screens/WelcomeScreen"
import SerwerConnection from "./components/SerwerConnection";

const Drawer = createDrawerNavigator();

export default function App() {

  //fetching data from serwer and saving it to AS
  const [loading, setLoading] = useState(true);
  const [testsD, setTestsD] = useState([]);
  const fetchDataFromSerwer = async () => {
    const results = await SerwerConnection.getResults();
    const tests = await SerwerConnection.getTests();
    setTestsD(tests);
    let testsDetails = {};
    for(let i = 0; i < tests.length; i++ ) {
        testsDetails[tests[i].id] = await SerwerConnection.getTestData(tests[i].id);
    }
    await AsyncStorage.setItem('results', JSON.stringify(results));
    await AsyncStorage.setItem('tests', JSON.stringify(tests));
    await AsyncStorage.setItem('tests_details', JSON.stringify(testsDetails));
  }

  //checking internet connection and fetching data from Serwer or AS 
  useEffect(()=>{
    NetInfo.fetch().then((state)=>{
      if(state.isConnected) {fetchDataFromSerwer(); setLoading(false);}
      else loadTests();
    })
  },[])

  //fetching tests from AS
  const loadTests = async() => {
    const tests = await AsyncStorage.getItem("tests");
    setTestsD(JSON.parse(tests))
    setLoading(false);
  } 

  //creating Drawer.Screen for each test
  const drawers = shuffle(testsD.map((item, i) => {
    return (
      <Drawer.Screen key={i} name={item.name} component={Tests} initialParams={{id: item.id}}/>
    )
  }))

  //Welcome screen using AsyncStorege
  const [firstUse, setFirstUse] = useState("false");
  useEffect(() => {
    loadFirstUse()
  }, []);
  const loadFirstUse = async() => {
    await AsyncStorage.getItem("firstUse").then((string) => setFirstUse(string));
  }
  const firstUseButton = async() => {
    setFirstUse("true");
    await AsyncStorage.setItem('firstUse', "true");
  };

  return (
    (firstUse == "true") ?
      (loading ? 
        <Text>Loading ...</Text>
        :
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home Page">
            <Drawer.Screen name="Home Page" component={HomeScreen} initialParams={{fetchDataFromSerwer : fetchDataFromSerwer}}/>
            <Drawer.Screen name="Results" component={Results} />
            {drawers}
          </Drawer.Navigator>
        </NavigationContainer>
      )
    :
      <WelcomeScreen save={firstUseButton}/>
  );
}