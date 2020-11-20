import React, {useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {TextInput, View} from 'react-native';

const setDate = (seconds) => {
  const date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
};

export default function Chat({chatId, userId}) {
  const [messages, setMessages] = useState([]);
  const [id] = useState(1);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const tmpMessages = snapshot.docs.map((doc) => {
          // snapshot.docs.forEach((doc) => {
          const message = doc.data();
          const createdAt = setDate(message.createdAt.seconds);
          return {...message, createdAt};
        });
        setMessages(tmpMessages);
      });
    return () => subscriber();
  }, [chatId]);

  // const getMessages = async () => {
  //   return await new Promise((resovle, reject) => {
  //     firestore()
  //       .collection('Chats')
  //       .doc(chatId)
  //       .collection('Messages')
  //       .get()
  //       .then((querySnapshot) => {
  //         const tmpMessages = [];
  //         querySnapshot.forEach((message) => {
  //           const createdAt = setDate(message.data().createdAt.seconds);
  //           tmpMessages.push({...message.data(), createdAt});
  //         });
  //         setMessages(
  //           tmpMessages.reverse().sort((a, b) => b.createdAt - a.createdAt),
  //         );
  //         resovle('done');
  //       })
  //       .catch((err) => reject(err));
  //   });
  // };

  const onSend = (message = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message),
    );
    firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .add(message[0])
      .catch((err) => console.log('error sending message:', err));
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        style={{flex: 1}}
        renderAvatar={null}
        onSend={(message) => onSend(message)}
        user={{
          _id: id,
        }}
      />
    </View>
  );
}
