// ChatGlobal.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatGlobal = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slack Chat</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
      {response && <Text style={styles.response}>{response}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  response: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ChatGlobal;
