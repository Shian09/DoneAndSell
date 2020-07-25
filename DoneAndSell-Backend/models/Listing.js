const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  location: {
    type: String,
  },
});

mongoose.model("Listing", listingSchema);
