import React, {useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {Text, View} from 'react-native';

const setDate = (seconds) => {
  const date = new Date(1970, 0, 1);
  date.setSeconds(seconds);
  return date;
};
const sleep = async (t) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, t);
  });
};
export default function Chat({chatId, userId}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [id] = useState(2);
  const [userStatus, setUserStatus] = useState('offline');
  const [otherUserStatus, setOtherUserStatus] = useState('offline');
  const otherUserId = 'user1';

  useEffect(() => {
    const messagesSubscriber = firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const tmpMessages = snapshot.docs.map((doc) => {
          const message = doc.data();
          const createdAt = setDate(message.createdAt.seconds);
          return {...message, createdAt};
        });
        setMessages(tmpMessages);
      });
    const statusSubscriber = firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Status')
      .doc(otherUserId)
      .onSnapshot((snapshot) => {
        const user = snapshot.data();
        if (user?.status !== otherUserStatus) {
          setOtherUserStatus(user.status);
        }
      });
    return () => {
      messagesSubscriber();
      statusSubscriber();
    }
  }, [chatId, otherUserStatus]);

  const onTextInput = (textInput) => {
    if (textInput && userStatus !== 'typing') {
      setUserStatus('typing');
      setStatus('typing');
    } else if (!textInput && userStatus === 'typing') {
      setUserStatus('online');
      setStatus('online');
    }
    setText(textInput);
  };
  const setStatus = (status) => {
    firestore()
      .collection('Chats')
      .doc(chatId)
      .collection('Status')
      .doc(userId)
      .update({
        status,
      })
      .catch((err) => console.log('Error updating status:', err));
  };
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
      <View
        style={{
          top: 0,
          width: '100%',
          height: 50,
          backgroundColor: 'white',
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}>
        <Text style={{textAlign: 'center'}}>{otherUserStatus}</Text>
      </View>
      <GiftedChat
        messages={messages}
        style={{flex: 1}}
        onSend={(message) => onSend(message)}
        renderAvatar={null}
        onInputTextChanged={onTextInput}
        user={{
          _id: id,
        }}
      />
    </View>
  );
}
