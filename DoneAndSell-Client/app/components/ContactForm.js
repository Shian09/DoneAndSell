import React from "react";
import { Keyboard, Alert, StyleSheet } from "react-native";

import * as Yup from "yup";
import { Notifications } from "expo";

import { AppForm, AppFormField, SubmitButton } from "./forms";
import messagesApi from "../../api/messages";
import useAuth from "../hooks/useAuth";

const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

function ContactForm({ listing, title }) {
  const { user } = useAuth();
  let messageCred = null;
  const handleSubmit = async ({ message }, { resetForm }) => {
    Keyboard.dismiss();

    messageCred = {
      message: message,
      listingId: listing.listingId,
      to: listing.user.name,
      toEmail: listing.user.email,
      toPushNotificationToken: listing.user.pushNotificationToken,
      from: user.name,
      fromEmail: user.email,
      fromPushNotificationToken: user.pushNotificationToken,
      fromImageUrl: user.imageUrl,
    };

    const result = await messagesApi.send(messageCred);

    if (!result.ok) {
      console.log("Error", result);
      return Alert.alert("Error", "Could not send the message to the seller.");
    }

    resetForm();

    Notifications.presentLocalNotificationAsync({
      title: "Awesome!",
      body: `Your message was sent to ${messageCred.to}`,
    });
  };

  return (
    <AppForm
      initialValues={{ message: "" }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <AppFormField
        maxLength={255}
        multiline
        name="message"
        numberOfLines={3}
        placeholder="Message..."
        //style={styles.textInput}
      />
      <SubmitButton title={title} />
    </AppForm>
  );
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#fffafa",
  },
});
export default ContactForm;
