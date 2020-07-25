import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import * as Yup from "yup";

import listingsApi from "../../api/listings";
import Screen from "../components/Screen";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  AppFormPicker,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import AppFormImagePicker from "../components/forms/AppFormImagePicker";
import useLocation from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";
import useAuth from "../hooks/useAuth";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.string().required().min(1).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array()
    .required()
    .min(1, "Please select at least one image")
    .max(2, "You cannot select more than two images"),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
    label: "Furniture",
    value: "1",
  },
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Cars",
    value: "2",
  },
  {
    backgroundColor: "#fed330",
    icon: "camera",
    label: "Cameras",
    value: "3",
  },
  {
    backgroundColor: "#26de81",
    icon: "cards",
    label: "Games",
    value: "4",
  },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-heel",
    label: "Clothing & Stuff",
    value: "5",
  },
  {
    backgroundColor: "#45aaf2",
    icon: "basketball",
    label: "Sports",
    value: "6",
  },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: "7",
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-variant",
    label: "Books",
    value: "8",
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: "9",
  },
];

export default function ListingEditScreen() {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const handleSubmit = async (listing, { resetForm }) => {
    let email = user.email;
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location, email },
      (progress) => setProgress(progress)
    );

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the listing.");
    }

    resetForm();
  };

  return (
    <View style={styles.wholeView}>
      <ScrollView>
        <Screen style={styles.container}>
          <KeyboardAvoidingView behavior="padding">
            <UploadScreen
              onDone={() => setUploadVisible(false)}
              progress={progress}
              visible={uploadVisible}
            />
            <AppForm
              initialValues={{
                title: "",
                price: "",
                description: "",
                category: null,
                images: [],
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormImagePicker name="images" />
              <AppFormField maxLength={255} name="title" placeholder="Title" />
              <AppFormField
                width={150}
                name="price"
                placeholder="Price"
                keyboardType="numeric"
              />
              <AppFormPicker
                width="50%"
                items={categories}
                name="category"
                numberOfColumns={3}
                PickerItemComponent={CategoryPickerItem}
                placeholder="Category"
              />
              <AppFormField
                maxLength={255}
                multiline
                name="description"
                placeholder="Description"
                numberOfLines={3}
              />
              <SubmitButton title="Post" />
            </AppForm>
          </KeyboardAvoidingView>
        </Screen>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wholeView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 10,
    backgroundColor: "white",
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});
