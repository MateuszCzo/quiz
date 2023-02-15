import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Welcome Screen</Text>
      <TouchableOpacity onPress={() => props.save()}><Text>OK</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});