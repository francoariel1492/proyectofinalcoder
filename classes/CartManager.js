const fs = require("fs");
const cartPath = "carts.json";
const productsPath = "products.json";
const { ProductManager } = require("../classes/ProductManager");
const productManager = new ProductManager();

class CartManager {
  async getCarts() {
    try {
      if (fs.existsSync(cartPath)) {
        const data = await fs.promises.readFile(cartPath, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (err) {
      return console.log(err);
    }
  }

  async addCart() {
    const carts = await this.getCarts();
    try {
      const lastId = carts.reduce(
        (acc, curr) => {
          if (curr.id > acc.id) {
            return curr;
          } else {
            return acc;
          }
        },
        { id: 0 }
      );

      const cart = {
        id: lastId.id + 1,
        products: [],
      };
      carts.push(cart);
      await fs.promises.writeFile(cartPath, JSON.stringify(carts, null, "\t"));
      return carts;
    } catch (err) {
      return console.log(err);
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    try {
      const itemId = Object.values(carts).find((c) => c.id == cartId);
      if (itemId === undefined) {
        return undefined;
      } else {
        return itemId;
      }
    } catch (err) {
      return "Internal Server";
    }
  }
  async postCartProductsId(cartId, productId, exist) {
    try {
      const carts = await this.getCarts();
      const products = await productManager.getProducts();
      const cartIndex = carts.findIndex((cart) => cart.id == cartId);

      if (cartIndex === -1) {
        console.error(`Cart with id ${cartId} not found`);
        return "Cart not found";
      }

      const cart = carts[cartIndex];

      if (exist) {
        const productsArrayPosition = cart.products.findIndex(
          (item) => item.product == productId
        );
        cart.products[productsArrayPosition].quantity += 1;
      } else {
        const product = products.find((item) => item.id == productId);

        if (product) {
          const existingProduct = cart.products.find(
            (item) => item.product == productId
          );

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cart.products.push({ product: parseInt(productId), quantity: 1 });
          }
        } else {
            return "Product not found";
        }
      }
      carts[cartIndex] = cart;

      await fs.promises.writeFile(cartPath, JSON.stringify(carts, null, "\t"));

      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteCart(cartId) {
    let carts = await this.getCarts();
    try {
      const cart = Object.values(carts).find((c) => c.id == cartId);
      if (cart) {
        carts = carts.filter((c) => c.id != cartId);
        await fs.promises.writeFile(cartPath, JSON.stringify(carts), "utf-8");

        return "Cart deleted succesfully";
      } else {
        return "Cart doesn't exist";
      }
    } catch (err) {
      return console.error(err);
    }
  }


  async deleteCartProductsId(id, arrayProducts) {
    try {
      const ProductByIdMongo = await Cart.findByIdAndUpdate(id, {
        products: arrayProducts,
      });
      return "Cart product deleted";
    } catch (error) {
      return error;
    }
  }

  async deleteById(id) {
    try {
      const deleteByIdMongo = await Cart.findByIdAndDelete(id);
      return "deleted cart successfully";
    } catch (error) {
      return error;
    }
  }

  async deleteAll() {
    await Cart.deleteMany();
    return "All carts deleted";
  }

  async updateCartProductsId(idCart, idProduct, exist, quantity) {
    try {
      const cart = await Cart.findById(idCart);
      if (exist) {
        const productsArrayPosition = cart.products.findIndex(
          (item) => item.product == idProduct
        );
        cart.products[productsArrayPosition].quantity = quantity;
      } else {
        cart.products.push({ product: idProduct, quantity: quantity });
      }
      const response = Cart.findByIdAndUpdate(idCart, cart);
      return response;
    } catch (error) {
      return error;
    }
  }

  async updateCartId(idCart, products) {
    try {
      const cart = await Cart.findById(idCart);
      cart.products = products;
      const response = Cart.findByIdAndUpdate(idCart, cart);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { CartManager };
