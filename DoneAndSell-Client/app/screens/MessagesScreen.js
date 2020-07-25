import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Alert } from "react-native";

import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import ListItemSeperator from "../components/lists/ListItemSeperator";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import messagesApi from "../../api/messages";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

export default function MessagesScreen({ route, navigation }) {
  const myEmail = route.params;
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [messageAvailable, setMessageAvailable] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMessages = async (myEmail) => {
    setLoading(true);
    const result = await messagesApi.getMessages(myEmail);

    if (!result.ok) {
      setLoading(false);
      setError(true);
      return;
    }
    let data = result.data;

    let messagesFetched = [];
    let message = null;

    if (data.length) {
      setMessageAvailable(true);

      data.forEach((doc) => {
        message = {
          messageId: doc.messageId,
          message: doc.message,
          listingId: doc.listingId,
          to: doc.to,
          toEmail: doc.toEmail,
          toPushNotificationToken: doc.toPushNotificationToken,
          from: doc.from,
          fromEmail: doc.fromEmail,
          fromPushNotificationToken: doc.fromPushNotificationToken,
          fromImageUrl: doc.fromImageUrl,
        };

        messagesFetched = [...messagesFetched, message];
      });
      setError(false);
      setMessages(messagesFetched);
    } else {
      setLoading(false);
      setMessageAvailable(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages(myEmail);
  }, []);

  const handleDelete = async (messageId) => {
    const result = await messagesApi.deleteMessage(messageId);

    if (!result.ok) {
      Alert.alert(
        "Error",
        "An unexpected error occurred. The message could not be deleted"
      );
      return;
    }

    setMessages(messages.filter((message) => message.messageId !== messageId));
    Alert.alert("Success", "The message has been deleted");
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error ? (
          //Implement loading here if Retry is pressed.
          <>
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                {" "}
                Could not retrieve messages{" "}
              </AppText>
              <AppButton width="40%" title="Retry" onPress={loadMessages} />
            </View>
          </>
        ) : messageAvailable ? (
          <FlatList
            style={styles.screen}
            data={messages}
            keyExtractor={(message) => message.messageId.toString()}
            renderItem={({ item }) => (
              <ListItem
                title={item.from}
                subTitle={item.message}
                image={{ uri: item.fromImageUrl }}
                onPress={() => navigation.navigate("MessageReply", item)}
                renderRightActions={() => (
                  <ListItemDeleteAction
                    onPress={() => handleDelete(item.messageId)}
                  />
                )}
              />
            )}
            ItemSeparatorComponent={ListItemSeperator}
            refreshing={refreshing}
            onRefresh={() => {
              loadMessages(myEmail);
            }}
          />
        ) : (
          <View style={styles.noMessage}>
            <AppText style={styles.noText}>
              There is no message to show.
            </AppText>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    marginBottom: 5,
  },
  screen: {
    marginTop: -10,
  },
  noMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noText: {
    color: colors.mediumGrey,
  },
});
