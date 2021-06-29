import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";
import { TextInput } from "react-native-web";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add New Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);
  const checkInput = () => {
    if (!input.trim()) {
      alert("Please enter Room Name");
      return;
    } else {
      createChat();
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder='Enter Chat Room Name'
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        LeftIcon={
          <Icon name='wechat' type='antdesign' size={24} color='black' />
        }
      />

      <Button onPress={checkInput} title='Create Chat' />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    padding: 30,
    height: "100%",
  },
});
