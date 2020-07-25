import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView, Image, Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;

function BackgroundCarousel({
  images,
  resizeMode = "cover",
  height = 200,
  imageWidth = DEVICE_WIDTH,
}) {
  const scrollRef = useRef();

  const [selectedIndex, setSelectedIndex] = useState(0);

  updateSelectedIndex = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const indexSelected = Math.floor(contentOffset / viewSize);

    setSelectedIndex(indexSelected);
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        horizontal
        pagingEnabled
        onMomentumScrollEnd={updateSelectedIndex}
        ref={scrollRef}
      >
        {images.map((image, i) => (
          <Image
            key={image}
            source={{ uri: image }}
            resizeMode={resizeMode}
            style={{ width: imageWidth }}
          />
        ))}
      </ScrollView>
      <View style={styles.circleDiv}>
        {images.map((image, i) => (
          <View
            key={image}
            style={[
              styles.whiteCircle,
              { opacity: i === selectedIndex ? 0.5 : 1 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollview: {
    width: "100%",
  },
  backgroundImage: {
    height: "100%",
  },
  circleDiv: {
    position: "absolute",
    bottom: 15,
    height: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: "#fff",
  },
});

export default BackgroundCarousel;
