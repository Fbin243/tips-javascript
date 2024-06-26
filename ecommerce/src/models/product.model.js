const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_quantity: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
};
