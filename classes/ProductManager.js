const fs = require('fs')
const path = "products.json";

class ProductManager {
    constructor() {
      this.products = [];
      this.id = 0;
    }
  
    async addProduct({title, description, price, thumbnail, code, stock}) {
      const products = await this.getProducts();
      try {
        const lastId = products.reduce(
          (acc, curr) => {
            if (curr.id > acc.id) {
              return curr;
            } else {
              return acc;
            }
          },
          { id: 0 }
        );

        const product = {
          id: lastId.id + 1,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        if (products.find((product) => product.code == code)) {
          return console.log(`The product with code : ${product.code} already exist`);
        } else {
          products.push(product);
          await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
  
          return products;
        }
      } catch (err) {
        return console.log(err);
      }
    }
  
    async getProducts() {
      try {
        if (fs.existsSync(path)) {
          const data = await fs.promises.readFile(path, "utf-8");
          
          const products = JSON.parse(data);
          return products;
        } else {
          return [];
        }
      } catch (err) {
        return console.log(err);
      }
    }
  
    async getProductById(idProduct) {
      const products = await this.getProducts();
      try {
        const itemId = Object.values(products).find((product) => product.id == idProduct);
        if (itemId === undefined) {
          return console.error("Product not found");
        } else {
          return itemId;
        }
      } catch (err) {
        return console.error(err);
      }
    }
  
    async updateProduct(idProduct, propsProduct) {
      const products = await this.getProducts();
      try {
        const index = await products.findIndex((product) => product.id == idProduct);
        if (index === -1) {
          return { error: `Product with id ${idProduct} doesn't exist` };
        } else {
          Object.assign(products[index], propsProduct);
          await fs.promises.writeFile(path, JSON.stringify(products), "utf-8");
          const updatedProduct = products[index];
    
          return updatedProduct;
        }
      } catch (err) {
        return { error: err.message };
      }
    }
    
  
    async deleteProduct(idProduct) {
      let products = await this.getProducts();
      try {
        const product = Object.values(products).find((e) => e.id == idProduct);
        if (product) {
          products = products.filter((item) => item.id != idProduct);
          await fs.promises.writeFile(path, JSON.stringify(products), "utf-8");
  
          return "Product deleted succesfully";
        } else {
          return "Product doesn't exist";
        }
      } catch (err) {
        return console.error(err);
      }
    }
  }

module.exports = {ProductManager}