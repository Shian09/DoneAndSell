import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../../api/listings";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

function UserListingsScreen({ route }) {
  const userEmail = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [listingsAvailable, setListingsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUserListings = async (email) => {
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
    loadUserListings(userEmail);
  }, []);

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {error ? (
          <View style={styles.errorContainer}>
            <AppText style={styles.errorText}>
              {" "}
              Could not retrieve listings{" "}
            </AppText>
            <AppButton width="40%" title="Retry" onPress={loadUserListings} />
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
              />
            )}
            refreshing={refreshing}
            onRefresh={() => {
              loadUserListings(userEmail);
            }}
          />
        ) : (
          <View style={styles.noMessage}>
            <AppText style={styles.noText}>No listing available</AppText>
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

export default UserListingsScreen;
