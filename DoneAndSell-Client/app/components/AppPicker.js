import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import AppText from "./AppText";
import colors from "../config/colors";
import Screen from "./Screen";
import PickerItem from "./PickerItem";

export default function AppPicker({
  icon,
  items,
  numberOfColumns = 1,
  placeholder,
  onSelectItem,
  PickerItemComponent = PickerItem,
  selectedItem,
  width = "100%",
}) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={colors.mediumGrey}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <AppText style={styles.text}> {selectedItem.label} </AppText>
          ) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.mediumGrey}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <MaterialCommunityIcons
            style={styles.btn}
            name="close"
            color={colors.primary}
            size={25}
            onPress={() => setModalVisible(false)}
          />
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            numColumns={numberOfColumns}
            renderItem={({ item }) => (
              <PickerItemComponent
                item={item}
                label={item.label}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </Screen>
      </Modal>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  container: {
    backgroundColor: colors.lightGrey,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.mediumGrey,
    flex: 1,
  },
  text: {
    flex: 1,
  },
});
