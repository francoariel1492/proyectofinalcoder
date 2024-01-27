const { Router } = require("express");
const { CartManager } = require("../classes/CartManager");
const cartManager = new CartManager();
const { ProductManager } = require("../classes/ProductManager");
const productManager = new ProductManager();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ mesagge: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const createdCart = await cartManager.addCart({});
    res.json({ mesagge: createdCart });
  } catch (error) {
    res.status(500).json({ mesagge: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await cartManager.getCartById(cartId);
    if (cart === undefined) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updateCartProducts = await cartManager.postCartProductsId(cartId, productId);
        if(typeof updateCartProducts === 'string'){
          return res.status(500).json({message: updateCartProducts})
        }
        res.status(200).json({ message: "Cart updated successfully", cart: updateCartProducts });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const getCartById = await cartManager.getCartById(cartId);
    const getProductById = await productManager.getProductById(productId);
    const productoTitulo = getProductById.title;

    const verifyExistence = getCartById.products.find(
      (p) => p.product._id == productId
    );
    if (verifyExistence === undefined) {
      res.status(404).json({ mesagge: "not found" });
    } else {
      const productsArrayPosition = getCartById.products.findIndex(
        (item) => item.id === productId
      );
      getCartById.products.splice(productsArrayPosition, 1);
      let newArray = getCartById.products;
      const deleteCartProducts = await cartManager.deleteCartProductsId(
        cartId,
        newArray
      );
      res.status(200).json({ mesagge: deleteCartProducts });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server rerror" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const getById = await cartManager.deleteCart(cartId);
    res.status(200).json({ mesagge: getById });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const pDeleted = await cartManager.deleteAll();
    res.status(200).json({ mesagge: pDeleted });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const getCartById = await cartManager.getCartById(cartId);

  const verifyExistence = getCartById.products.find(
    (e) => e.product == productId
  );

  if (verifyExistence) {
    const updateCartProducts = await cartManager.updateCartProductsId(
      cartId,
      productId,
      true,
      quantity
    );
    res.status(200).json({ mesagge: "cart products updated" });
  } else {
    const updateCartProducts = await cartManager.updateCartProductsId(
      cartId,
      productId,
      false,
      quantity
    );
    res.status(200).json({ mesagge: "cart products updated" });
  }
});

router.put("/:cid", async (req, res) => {
  const { products } = req.body;
  const cartId = req.params.cid;
  const getCartById = await cartManager.updateCartId(cartId, products);
  res.status(200).json(getCartById);
});

module.exports = router;
