import express from 'express';
import {
    addCustomerController,
    deleteCustomerController,
    getCustomerController,
    getCustomersByNumberController,
    updateCustomerController,
} from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.get('/get-customers', getCustomerController);

customerRouter.get('/get-customers-by-number', getCustomersByNumberController);

customerRouter.post('/add-customers', addCustomerController);

customerRouter.put('/update-customers', updateCustomerController);

customerRouter.post('/delete-customers', deleteCustomerController);

export default customerRouter;
