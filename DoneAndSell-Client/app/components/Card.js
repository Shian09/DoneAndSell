import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";
import BackgroundCarousel from "./BackgroundCarousel";

const DEVICE_WIDTH = Dimensions.get("window").width;

export default function Card({ images, title, subTitle, onPress }) {
  return (
    <>
      <View style={styles.card}>
        <BackgroundCarousel images={images} imageWidth={DEVICE_WIDTH - 40} />
        <TouchableOpacity onPress={onPress}>
          <View style={styles.detailsContainer}>
            <AppText style={styles.title} numberOfLines={1}>
              {title}
            </AppText>
            <AppText style={styles.subTitle} numberOfLines={2}>
              {subTitle}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "white",
    marginBottom: 20,
    overflow: "hidden",
  },

  detailsContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 7,
    fontWeight: "bold",
  },
  subTitle: {
    color: colors.secondary,
    fontWeight: "bold",
  },
});
