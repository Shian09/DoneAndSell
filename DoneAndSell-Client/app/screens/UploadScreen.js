import React from "react";
import { StyleSheet, View, Modal, Text } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";

import colors from "../config/colors";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <Progress.Bar color={colors.primary} progress={progress} width={150} />
        {progress === 1 && (
          <LottieView
            source={require("../assets/animations/done.json")}
            autoPlay
            loop={false}
            onAnimationFinish={onDone}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  progress: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default UploadScreen;
