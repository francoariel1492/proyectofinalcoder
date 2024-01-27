const { Router } = require("express");
const { ProductManager } = require("../classes/ProductManager");
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (!limit) {
      res.status(200).json(products);
    } else {
      const pLimit = products.slice(0, limit);
      res.status(200).json(pLimit);
    }
  } catch (err) {
    res.status(400).json({ error: "Algo salio mal" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail = null,
      code,
      stock,
      status = true,
      category,
    } = req.body;
    if (typeof status !== "boolean") {
      return res
        .status(400)
        .json({ message: "Status must be a boolean value" });
    }
    if (!title || !description || !price || !code || !stock || !category) {
      return res
        .status(400)
        .json({ mesagge: "Product with missing information" });
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };
    const createdProduct = await productManager.addProduct(newProduct);
    res.status(200).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;

    const newUpdatedProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    };
    const verifyExistenceUndefined =
      Object.values(newUpdatedProduct).indexOf(undefined);

      if (typeof status !== "boolean") {
        return res
          .status(400)
          .json({ message: "Status must be a boolean value" });
      }
      
    if (verifyExistenceUndefined === -1) {
        const updatedProduct = await productManager.updateProduct(
          productId,
          newUpdatedProduct
        );
        if(updatedProduct.error){
            res.status(500).json({message: updatedProduct.error})
            return
        }
        res.json({ message: "Product updated successfully", product: updatedProduct });
      } else {
        res.status(406).json({ message: "Product with missing information" });
      }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productManager.deleteProduct(productId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.mesagge });
  }
});


module.exports = router;
