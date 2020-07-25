import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../../api/listings";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

function MyListingScreen({ route }) {
  const myEmail = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [listingsAvailable, setListingsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //Load my listings
  const loadMyListings = async (email) => {
    setLoading(true);
    const result = await listingsApi.getUserListings(email);

    if (!result.ok) {
      setLoading(false);
      setError(true);
      return;
    }

    let data = result.data;

    let listingsFetched = [];
    let listing = null;

    if (data.length) {
      setListingsAvailable(true);

      data.forEach((doc) => {
        listing = {
          listingId: doc.listingId,
          images: doc.images,
          title: doc.title,
          price: doc.price,
          categoryId: doc.categoryId,
          description: doc.description,
        };

        listingsFetched = [...listingsFetched, listing];
      });
      setError(false);
      setListings(listingsFetched);
    } else {
      setLoading(false);
      setListingsAvailable(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMyListings(myEmail);
  }, []);

  //Delete My listing
  const deleteListing = async (listingId) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this product listing?",
      [
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            const result = await listingsApi.deleteListing(listingId);

            if (!result.ok) {
              setLoading(false);
              Alert.alert(
                "Error",
                "An unexpected error occurred. The listing could not be deleted"
              );
              return;
            }
            setLoading(false);
            Alert.alert("Successful", "The listing was deleted successfully.");
            setListings(
              listings.filter((listing) => listing.listingId !== listingId)
            );
            if (!listings.length) {
              setListingsAvailable(false);
            }
          },
        },
        { text: "No" },
      ]
    );
    return;
  };

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error ? (
          //Implement loading here if Retry is pressed.

          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              {" "}
              Could not retrieve listings{" "}
            </AppText>
            <AppButton
              width="40%"
              title="Retry"
              onPress={() => loadMyListings(myEmail)}
            />
          </View>
        ) : listingsAvailable ? (
          <FlatList
            style={styles.flatList}
            data={listings}
            keyExtractor={(listing) => listing.listingId.toString()}
            renderItem={({ item }) => (
              <Card
                title={item.title}
                subTitle={"$" + item.price}
                images={item.images}
                onPress={() => deleteListing(item.listingId)}
              />
            )}
            refreshing={refreshing}
            onRefresh={() => {
              loadMyListings(myEmail);
            }}
          />
        ) : (
          <View style={styles.noMessage}>
            <AppText style={styles.noText}>
              You have no listing to show.
            </AppText>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    marginTop: -23,
  },
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
  noMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noText: {
    color: colors.mediumGrey,
  },
});

export default MyListingScreen;
