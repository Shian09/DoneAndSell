import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

function AppActivityIndicator({ visible = false }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("../assets/animations/loader.json")}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    opacity: 0.8,
    zIndex: 1,
  },
});

export default AppActivityIndicator;
