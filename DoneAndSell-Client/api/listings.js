import client from "./client";
import { Platform } from "react-native";

const endpoint = "/listings";

/********************Upload a photo ********************/
const upload = async (imagesArray) => {
  let imageUrls = [];

  let i = 0;

  for (i = 0; i < imagesArray.length; i++) {
    let splittedArray = imagesArray[i].split("/");
    let imageName = splittedArray[splittedArray.length - 1];

    const uri =
      Platform.OS === "android"
        ? imagesArray[i]
        : imagesArray[i].replace("file://", "");
    const type = "image/" + `${imagesArray[i].substr(imagesArray.length - 3)}`;
    const name = imageName;
    const source = { uri, type, name };

    const data = new FormData();
    data.append("file", source);
    data.append("upload_preset", "doneandsell");
    data.append("cloud_name", "shian");

    await fetch("https://api.cloudinary.com/v1_1/shian/image/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
      .then(async (res) => res.json())
      .then((data) => {
        imageUrls = [...imageUrls, data.url];
      })
      .catch((err) => {
        console.log("Failed to upload. Error: ", err);
        return;
      });
  }

  return imageUrls;
};

/*******************Get all listings ********************/
const getListings = () => client.get(endpoint);

/*******************Get a user's listings ********************/
const getUserListings = (email) => client.get(`/listings/${email}`);

/**************************Get a listing***********************/
const getListing = (listingId) => client.get(`/listing/${listingId}`);

/***************************Post a listing ***************************/
const addListing = async (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);
  data.append("email", listing.email);

  const imageUrls = await upload(listing.images, onUploadProgress);

  imageUrls.forEach((url) => {
    data.append("images", url);
  });

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  return client.post("/listing", data, {
    onUploadProgress: (progress) => {
      onUploadProgress(progress.loaded / progress.total);
    },
  });
};

/**********************************Delete a listing*************************/

const deleteListing = async (listingId) =>
  client.delete(`/listing/${listingId}`);

export default {
  getListings,
  addListing,
  getUserListings,
  getListing,
  deleteListing,
};
