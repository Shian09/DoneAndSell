const express = require("express");
const listingRouter = express.Router();
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const Listing = mongoose.model("Listing");
const User = mongoose.model("User");
const Message = mongoose.model("Message");

/******************Get all listings*************************/
listingRouter.get("/listings", requireAuth, async (req, res) => {
  let listings = [];
  let listing = null;
  let docs = [];

  try {
    docs = await Listing.find();
    if (docs.length) {
      let i = 0;
      for (i = 0; i < docs.length; i++) {
        const response = await User.findOne({ email: docs[i].email });

        const count = await Listing.find({ email: docs[i].email }).count();

        listing = {
          user: {
            name: response.username,
            count,
            imageUrl: response.imageUrl,
            email: docs[i].email,
            pushNotificationToken: response.pushNotificationToken,
          },
          images: docs[i].images,
          listingId: docs[i]._id,
          title: docs[i].title,
          price: docs[i].price,
          categoryId: docs[i].categoryId,
          description: docs[i].description,
        };

        if (docs[i].location) {
          const location = JSON.parse(docs[i].location);
          listing = { ...listing, location };
        }
        listings = [...listings, listing];
      }

      return res.status(200).json(listings);
    } else {
      return res.status(200).json("There is no listing to show.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching the listings.", err);
  }
});

/*******************Get a user's listings*****************/
listingRouter.get("/listings/:email", requireAuth, async (req, res) => {
  const { email } = req.params;
  let listing = null;
  let listingsFetched = [];

  try {
    const result = await Listing.find({ email: email });

    result.forEach((data) => {
      listing = {
        listingId: data._id,
        images: data.images,
        title: data.title,
        price: data.price,
        categoryId: data.categoryId,
        description: data.description,
      };
      listingsFetched = [...listingsFetched, listing];
    });
    res.status(200).json(listingsFetched);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching the listings.", err);
  }
});

/******************Get a listing**************************/
listingRouter.get("/listing/:listingId", requireAuth, async (req, res) => {
  const { listingId } = req.params;
  let listing = null;
  try {
    const result = await Listing.findOne({ _id: listingId });

    listing = {
      listingId: result._id,
      images: result.images,
      title: result.title,
      price: result.price,
      categoryId: result.categoryId,
      description: result.description,
    };
    res.status(200).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching the listing.", err);
  }
});

/******************Post a listing*************************/
listingRouter.post("/listing", requireAuth, async (req, res) => {
  let listingPosted = null;
  const {
    title,
    price,
    categoryId,
    images,
    description,
    location,
    email,
  } = req.body;

  const listing = new Listing({
    email,
    title,
    price,
    categoryId,
    description,
    images,
    location,
  });

  try {
    const result = await listing.save();

    listingPosted = {
      images: result.images,
      listingId: result.id,
      title: result.title,
      price: result.price,
      categoryId: result.categoryId,
      description: result.description,
    };
    if (result.location) {
      let location = JSON.parse(result.location);
      listingPosted = { ...listingPosted, location };
    }

    return res.status(201).json(listingPosted);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

/*********************Delete a listing***********************/
listingRouter.delete("/listing/:listingId", requireAuth, async (req, res) => {
  const { listingId } = req.params;

  try {
    await Listing.deleteOne({ _id: listingId });
    await Message.deleteMany({ listingId: listingId });

    res.status(204).json({ success: "The listing has been deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting the listing.", err);
  }
});

module.exports = listingRouter;
