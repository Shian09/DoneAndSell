import React from "react";
import { StyleSheet, View, TouchableNativeFeedback } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function NewListingButton({ onPress }) {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="plus-circle" color="white" size={40} />
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderColor: "white",
    borderWidth: 10,
    bottom: 25,
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewListingButton;
