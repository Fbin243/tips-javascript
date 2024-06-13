"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// Define Factory class to create product
class ProductService {
  /**
   * type: Clothing | Electronics
   */
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronics":
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // Create new product
  async createProduct() {
    return await product.create(this);
  }
}

// Define sub-class for different product types
class Clothing extends Product {
  // Create new clothing product
  async createProduct() {
    const newClothing = clothing.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("Failed to create new clothing attributes");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Failed to create new product");

    return newProduct;
  }
}

class Electronics extends Product {
  // Create new electronic product
  async createProduct() {
    const newElectronic = electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Failed to create new electronic attributes");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Failed to create new product");

    return newProduct;
  }
}

module.exports = ProductService;
