import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import listingsApi from "../../api/listings";
import ContactForm from "../components/ContactForm";
import BackgroundCarousel from "../components/BackgroundCarousel";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/AppActivityIndicator";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";

function MessageReplyScreen({ route }) {
  const message = route.params;

  const [listing, setListing] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadListing = async (listingId) => {
    setLoading(true);
    const result = await listingsApi.getListing(listingId);

    if (!result.ok) {
      setError(true);
      setLoading(false);
      return;
    }

    setListing(result.data);
    setError(false);
    setLoading(false);
  };

  const replyToSend = {
    user: {
      name: message.from,
      email: message.fromEmail,
      pushNotificationToken: message.fromPushNotificationToken,
    },
    listingId: message.listingId,
  };

  useEffect(() => {
    loadListing(message.listingId);
  }, []);

  return (
    <>
      <AppActivityIndicator visible={loading} />
      <View style={styles.wholeView}>
        <ScrollView>
          {error ? (
            <>
              <View style={styles.errorContainer}>
                <AppText style={styles.errorText}>
                  {" "}
                  Could not show the listing. An unexpected error occured{" "}
                </AppText>
                <AppButton width="40%" title="Retry" onPress={loadListing} />
              </View>
            </>
          ) : (
            listing && (
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
                  <View style={styles.messageContainer}>
                    <ListItem
                      title={message.from}
                      subTitle={message.message}
                      image={{ uri: message.fromImageUrl }}
                      showChevron={false}
                    />
                  </View>
                  <ContactForm listing={replyToSend} title="Reply" />
                </View>
              </View>
            )
          )}
        </ScrollView>
      </View>
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
  messageContainer: {
    marginVertical: 10,
    marginLeft: -15,
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
});

export default MessageReplyScreen;
