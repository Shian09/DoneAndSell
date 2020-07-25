import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

import AccountNavigator from "./AccountNavigator";
import FeedNavigator from "./FeedNavigator";
import ListingEditScreen from "../screens/ListingEditScreen";
import NewListingButton from "./NewListingButton";
import expoPushTokensApi from "../../api/expoPushTokens";
import useAuth from "../hooks/useAuth";
import { Platform } from "react-native";
import navigation from "./rootNavigation";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    registerForPushNotifications();

    Notifications.addListener((notification) => {
      if (Platform.OS === "android" && notification.origin === "selected") {
        navigation.navigate("Account");
      }

      if (Platform.OS === "ios") {
        navigation.navigate("Account");
      }
    });
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (!permission.granted) return;

      const token = await Notifications.getExpoPushTokenAsync();

      const result = await expoPushTokensApi.register(token, user.email);

      if (result.data.pushNotificationToken !== user.pushNotificationToken) {
        setUser(result.data);
      }
    } catch (error) {
      console.log("Error getting a push token. ", error);
    }
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("notification-sound-channel", {
        name: "Notification Sound Channel",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#f72d55",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("ListingEdit")}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
