import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import shuffle from 'lodash.shuffle';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Tests({route, navigation}) {

  //fetching data for test
  const {id} = route.params;
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let result = JSON.parse(await AsyncStorage.getItem('tests_details'))[id];
    shuffle(result.tasks);
    setData(result);
    setIsLoading(false);
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  //validate answer
  const validateAnswer = (selectedOption) => {
    if(selectedOption.isCorrect === true) {
        setScore((oldState) => oldState += 1);
    }
    setIsOptionsDisabled(true);
    setShowNextButton(true);
  }

  //next question
  const handleNext = () => {
    if(currentQuestion === data.tasks.length-1) {
        setShowNextButton(false);
        setShowFinishButton(true);
    }
    else {
      setCurrentQuestion((oldState) => oldState += 1);
      setIsOptionsDisabled(false);
      setShowNextButton(false);
    }
  }

  //finish test
  const handleFinish = () => {
    setIsFinished(true);
    setShowFinishButton(false);
  }

  //render answers
  const renderAnswers = () => {
    return (
      shuffle(data.tasks[currentQuestion].answers.map((item, i) => {
        return (
          <TouchableOpacity key={i} onPress={() => validateAnswer(item)} disabled={isOptionsDisabled} style={styles.answers}>
            <Text>{item.content}</Text>
          </TouchableOpacity>
        )
      }))
    )
  }

  //send result tto serwer and navigate to Results
  const endTest = () => {
    fetch('https://tgryl.pl/quiz/result', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nick: "Jan123",
        score: score,
        total: data.tasks.length,
        type: "historia",
      }),
    })
    setCurrentQuestion(0)
    setScore(0)
    setIsOptionsDisabled(false)
    setShowNextButton(false)
    setShowFinishButton(false)
    setIsFinished(false)
    navigation.navigate('Results')
  }

  return (
    isLoading ? 
      <Text>Loading ...</Text>
    :
      <View style={styles.container}>
        <Text style={{fontSize: 24}}>{data.tasks[currentQuestion].question}</Text>
        {renderAnswers()}
        {showNextButton && (
        <TouchableOpacity onPress={handleNext} style={styles.button2}><Text>Next</Text></TouchableOpacity>
        )}
        {showFinishButton && (
          <TouchableOpacity onPress={handleFinish} style={styles.button}><Text>Finish</Text></TouchableOpacity>
        )}
        {isFinished && (
          <View>
            <Text>Zakończono quiz</Text>
            <Text>Zdobyte punkty: {score}</Text>
            <TouchableOpacity style={styles.button2} onPress={endTest}><Text>Zakoncz</Text></TouchableOpacity>
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingStart: 20,
    paddingEnd: 20,
    backgroundColor: '#eeeeee'
  },
  answers: {
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: 'gray',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10
  },
  button2: {
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: 'lightblue',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10
  }
});