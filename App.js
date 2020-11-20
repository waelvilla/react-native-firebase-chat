import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Chat from './Chat';
import Chat2 from './Chat2';

const App = () => {
  const chatId = '1234';
  const userId = 'asdf1234';
  const [active, setActive] = useState(true);
  return (
    <View style={{flex:1}}>
      <TouchableOpacity onPress={() => setActive(!active)}>
      <Text>Chat {active? '1' : '2'}</Text>
      </TouchableOpacity>
      {active ? (
        <Chat chatId={chatId} userId={userId} />
      ) : (
        <Chat2 chatId={chatId} userId={userId} />
      )}
    </View>
  );
};

export default App;
