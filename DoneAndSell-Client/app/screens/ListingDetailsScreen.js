import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import AppText from "../components/AppText";
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import BackgroundCarousel from "../components/BackgroundCarousel";
import ContactForm from "../components/ContactForm";

export default function ListingDetailsScreen({ route, navigation }) {
  const listing = route.params;
  let mapRef = null;

  return (
    <View style={styles.wholeView}>
      <ScrollView>
        <View>
          <BackgroundCarousel
            images={listing.images}
            resizeMode="stretch"
            height={300}
          />
          <View style={styles.detailsContainer}>
            <AppText style={styles.title}>{listing.title}</AppText>
            <AppText
              style={styles.description}
            >{`Seller says: ${listing.description}`}</AppText>
            <AppText style={styles.price}>${listing.price}</AppText>
            <View style={styles.userContainer}>
              <ListItem
                image={{ uri: listing.user.imageUrl }}
                title={listing.user.name}
                subTitle={`${listing.user.count} listings`}
                onPress={() =>
                  navigation.navigate("PersonalListings", listing.user.email)
                }
              />
            </View>
            <ContactForm listing={listing} title="Contact Seller" />
          </View>
        </View>
        {listing.location ? (
          <View style={styles.mapContainer}>
            <MapView
              showsMyLocationButton
              showsScale
              showsIndoors
              showsBuildings
              showsCompass
              showsTraffic
              maxZoomLevel={20}
              mapType="standard"
              ref={(ref) => {
                mapRef = ref;
              }}
              onLayout={() => {
                mapRef.fitToElements(true);
              }}
              style={styles.mapStyle}
              provider={PROVIDER_GOOGLE}
            >
              <Marker
                coordinate={listing.location}
                title={listing.user.name}
                description="Seller"
                focusable
              >
                <View style={styles.markerView}>
                  <Image
                    source={{ uri: listing.user.imageUrl }}
                    style={styles.marker}
                  />
                </View>
              </Marker>
            </MapView>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wholeView: {
    flex: 1,
    backgroundColor: "white",
  },
  detailsContainer: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    color: colors.mediumGrey,
    marginVertical: 5,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userContainer: {
    marginTop: 10,
    marginBottom: 15,
    marginLeft: -15,
  },
  marker: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
  },
  markerView: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderBottomRightRadius: 0,
    backgroundColor: "green",
    borderColor: "green",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    flex: 1,
    width: Dimensions.get("window").width - 20,
    height: 300,
  },
});
