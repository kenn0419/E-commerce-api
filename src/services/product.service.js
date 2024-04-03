'use strict'

const { product, clothing, electronic, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
    findAllDraftForShop,
    publicProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProduct, } = require("../models/repositories/product.repo");
const { removeUndefindedObject, updateNestedObject } = require("../utils");

//define factory class to create product
class ProductFactory {
    static productRegistry = {};
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product Type:', type);
        }
        return new productClass(payload).createProduct();
    }

    // PUT
    static async publicProductByShop({ product_shop, product_id }) {
        return publicProductByShop({ product_shop, product_id });
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return unPublishProductByShop({ product_shop, product_id });
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product Type:', type);
        }
        return new productClass(payload).updateProduct(productId);
    }

    // QUERY
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }
    static async searchProducts({ keySearch }) {
        return await searchProducts({ keySearch });
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v', 'createdAt', 'updatedAt'] })
    }

    // END QUERY

}

//define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    //create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }
    async updateProduct(productId, payload) {
        return await updateProduct({ productId, payload, model: product });
    }
}

//define sub-class for different product type Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError('Created new Clothing failed');
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create new product failed');
        return newProduct;
    }

    async updateProduct(productId) {
        //1. Remove attributes null and undefinded
        //2. check where update
        const objectParams = removeUndefindedObject(this);
        if (objectParams.product_attributes) {
            //update child
            await updateProduct({ productId, payload: updateNestedObject(objectParams.product_attributes), model: clothing });
        }
        const updatedProduct = await super.updateProduct(productId, updateNestedObject(objectParams));
        return updatedProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) throw new BadRequestError('Created new Clothing failed');
        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('Create new product failed');
        return newProduct;
    }
    async updateProduct(productId) {
        //1. Remove attributes null and undefinded
        //2. check where update
        const objectParams = removeUndefindedObject(this);
        if (objectParams.product_attributes) {
            //update child
            await updateProduct({ productId, payload: updateNestedObject(objectParams.product_attributes), model: electronic });
        }
        const updatedProduct = await super.updateProduct(productId, updateNestedObject(objectParams));
        return updatedProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) throw new BadRequestError('Created new Clothing failed');
        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Create new product failed');
        return newProduct;
    }
    async updateProduct(productId) {
        //1. Remove attributes null and undefinded
        //2. check where update
        const objectParams = removeUndefindedObject(this);
        if (objectParams.product_attributes) {
            //update child
            await updateProduct({ productId, payload: updateNestedObject(objectParams.product_attributes), model: furniture });
        }
        const updatedProduct = await super.updateProduct(productId, updateNestedObject(objectParams));
        return updatedProduct;
    }
}

//register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furnitures', Furniture);
ProductFactory.registerProductType('Electronics', Electronic);

module.exports = ProductFactory;