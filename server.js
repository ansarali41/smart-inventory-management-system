import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import billsRouter from './routes/billsRoutes.js';
import customerRouter from './routes/customersRoutes.js';
import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
//require('colors');

dotenv.config();

//Connect with MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch(err => {
        console.log(err.message);
    });

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

//routes
app.use('/api/products/', productRouter);
app.use('/api/users/', userRouter);
app.use('/api/bills/', billsRouter);
app.use('/api/customers/', customerRouter);

//Create Port
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
    console.log(`Serve at running on the port: http://localhost:${PORT}`);
});
