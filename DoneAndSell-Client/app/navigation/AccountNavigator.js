import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import colors from "../config/colors";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyListingsScreen from "../screens/MyListingsScreen";
import MessageReplyScreen from "../screens/MessageReplyScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen
      name="Messages"
      component={MessagesScreen}
      options={{
        headerShown: true,
        headerTintColor: colors.primary,
        headerTitleAlign: "center",
        headerBackTitleVisible: true,
        headerTitleStyle: {
          color: "black",
          fontSize: 18,
        },
      }}
    />
    <Stack.Screen name="MessageReply" component={MessageReplyScreen} />
    <Stack.Screen
      name="MyListings"
      component={MyListingsScreen}
      options={{
        headerShown: true,
        headerTintColor: colors.primary,
        headerTitleAlign: "center",
        headerBackTitleVisible: true,
        headerTitleStyle: {
          color: "black",
          fontSize: 18,
        },
      }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
