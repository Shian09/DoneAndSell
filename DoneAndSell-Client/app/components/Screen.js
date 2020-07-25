import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

import Constants from "expo-constants";

import OfflineNotice from "./OfflineNotice";

export default function Screen(props) {
  return (
    <SafeAreaView style={styles.screen}>
      <OfflineNotice />
      <View style={[styles.view, props.style]}>{props.children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  view: {
    flex: 1,
  },
});
