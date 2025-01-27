import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { SLACK_TOKEN } from '@env';

const ChatGlobal = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Cargar mensajes iniciales desde Slack
    const fetchMessages = async () => {
      try {
        const response = await axios.get('https://slack.com/api/conversations.history', {
          params: {
            channel: 'C08A4JGLBBQ', // El ID del canal que deseas usar
          },
          headers: {
            Authorization: `Bearer ${SLACK_TOKEN}`, // Usar el token de Slack desde la variable de entorno
          },
        });

        if (response.data && response.data.ok) {
          const slackMessages = response.data.messages.map((msg, index) => ({
            _id: index,
            text: msg.text,
            createdAt: new Date(msg.ts * 1000),
            user: {
              _id: msg.user,
              name: 'Slack User', // Puedes obtener el nombre del usuario si es necesario
            },
          }));

          setMessages(slackMessages);
        } else {
          console.error('No messages found in response', response.data);
        }
      } catch (error) {
        console.error('Error fetching messages from Slack', error);
      }
    };

    fetchMessages();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const message = messages[0].text;
    try {
      const result = await axios.post(
        'http://192.168.1.76:3000/api/slack/sendMessage',
        {
          channel: 'C08A4JGLBBQ',  // El ID del canal que deseas usar
          text: message,           // El mensaje a enviar
        }
      );
      console.log(result.data.message || 'Message sent!'); // Respuesta del servidor
    } catch (error) {
      console.error('Error sending message', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatGlobal;