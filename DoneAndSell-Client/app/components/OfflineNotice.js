import React from "react";
import { StyleSheet, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

import Constants from "expo-constants";

import AppText from "./AppText";
import colors from "../config/colors";

function OfflineNotice() {
  const netInfo = useNetInfo();
  if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No Internet Connection</AppText>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 30,
    position: "absolute",
    top: Constants.statusBarHeight,
    zIndex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 15,
  },
});

export default OfflineNotice;
