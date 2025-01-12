import mongoose from 'mongoose';

//for create table into db
const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        createdBy: { type: String, required: true },
    },
    {
        //for date
        timestamps: true,
    },
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
