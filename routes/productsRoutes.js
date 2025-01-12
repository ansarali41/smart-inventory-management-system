import express from 'express';
import { addProductController, deleteProductController, getProductController, seedsProductController, updateProductController } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/getproducts', getProductController);

productRouter.post('/addproducts', addProductController);

productRouter.put('/updateproducts', updateProductController);

productRouter.post('/deleteproducts', deleteProductController);

productRouter.post('/seeds', seedsProductController);

export default productRouter;
