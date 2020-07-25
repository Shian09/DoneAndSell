import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";
import listingApi from "../../api/listings";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useApi from "../hooks/useApi";

export default function ListingScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, loading, request: loadListings } = useApi(
    listingApi.getListings
  );

  let listingsFetched = [];
  let listing = null;

  if (data) {
    data.forEach((doc) => {
      listing = {
        user: {
          name: doc.user.name,
          count: doc.user.count,
          imageUrl: doc.user.imageUrl,
          email: doc.user.email,
          pushNotificationToken: doc.user.pushNotificationToken,
        },
        images: doc.images,
        listingId: doc.listingId,
        title: doc.title,
        price: doc.price,
        categoryId: doc.categoryId,
        description: doc.description,
      };

      if (doc.location) {
        let location = doc.location;
        listing = { ...listing, location };
      }
      listingsFetched = [...listingsFetched, listing];
    });
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error && (
          //Implement loading here if Retry is pressed.
          <>
            <View style={styles.errorContainer}>
              <AppText style={styles.errorText}>
                {" "}
                Could not retrieve listings{" "}
              </AppText>
              <AppButton width="40%" title="Retry" onPress={loadListings} />
            </View>
          </>
        )}
        {!error && (
          <>
            <FlatList
              data={listingsFetched}
              keyExtractor={(listing) => listing.listingId.toString()}
              renderItem={({ item }) => (
                <Card
                  title={item.title}
                  subTitle={"$" + item.price}
                  //Change this "uri" to another name later
                  images={item.images}
                  onPress={() => navigation.navigate("ListingDetails", item)}
                />
              )}
              refreshing={refreshing}
              onRefresh={() => {
                loadListings();
              }}
            />
          </>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    marginBottom: 5,
  },
  screen: {
    padding: 20,
  },
});
