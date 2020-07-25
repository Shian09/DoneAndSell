import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingScreen from "../screens/ListingScreen";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import colors from "../config/colors";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    mode="modal"
  >
    <Stack.Screen name="Listings" component={ListingScreen} />
    <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
    <Stack.Screen
      name="PersonalListings"
      component={UserListingsScreen}
      options={{
        headerShown: true,
        headerTintColor: colors.primary,
        headerTitleAlign: "center",
        headerBackTitleVisible: true,
        headerBackTitle: false,
        headerTitleStyle: {
          color: "black",
          fontSize: 18,
        },
      }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
