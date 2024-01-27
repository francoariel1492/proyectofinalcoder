const productsController = require('../products/controller.products')
const cartsController = require('../carts/controller.carts')


const router = app => {

  app.use('/api/products', productsController)
  app.use('/api/carts', cartsController)
}

module.exports = router