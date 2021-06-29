import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native-web";
import { ScrollView } from "react-native";
import { Keyboard } from "react-native";
import { db, auth } from "../firebase";
import * as firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -25,
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "700",
              fontSize: 17,
            }}
          >
            {route.params.chatName}
          </Text>
        </View>
      ),
      // headerLeft: () => (
      //     <TouchableOpacity style={{ marginLeft: 10}} onPress={navigation.goBack}>
      //         <AntDesign name="arrowleft" size={24} color="white"/>
      //     </TouchableOpacity>
      // ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 70,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name='video-camera' size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='call' size={22} color='white' />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style='light' />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={65}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    {/* <Avatar 
                                        rounded size={25} position="absolute"
                                        //Mobile
                                        bottom={-12} right={-5}
                                        //Web
                                        containerStyle={{ position: "absolute", bottom: -15, right: -5}}
                                        source={{uri: data.photoURL,}}
                                    /> */}
                    <Text style={styles.receiverText}> {data.message} </Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      size={25}
                      position='absolute'
                      //Mobile
                      bottom={-7}
                      left={-5}
                      //Web
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: data.photoURL }}
                    />
                    <Text style={styles.senderText}> {data.message} </Text>
                    <Text style={styles.senderName}> {data.displayName} </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder='Enter Message'
                style={styles.textInput}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name='send' size={24} color='#2B68E6' />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 9,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 14,
    marginRight: 15,
    marginBottom: 7,
    maxWidth: "70%",
    position: "relative",
  },
  sender: {
    padding: 10,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 14,
    marginLeft: 15,
    marginBottom: 7,
    maxWidth: "70%",
    position: "relative",
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 5,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    paddingLeft: 15,
    color: "grey",
    borderRadius: 30,
  },
});
