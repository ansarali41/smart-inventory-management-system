import Customer from '../models/customerModel.js';

//for add or fetch
export const getCustomerController = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (error) {
        console.log(error);
    }
};
// find by number
export const getCustomersByNumberController = async (req, res) => {
    try {
        // find by number as matching using regex
        const customers = await Customer.find({
            phone: { $regex: req.query.phone },
            createdBy: req.query.createdBy,
        })
            .limit(5)
            .sort({ createdAt: -1 });

        res.status(200).send(customers);
    } catch (error) {
        console.log(error);
    }
};

//for add
export const addCustomerController = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(200).send('Customer Created Successfully!');
    } catch (error) {
        console.log(error);
    }
};

//for update
export const updateCustomerController = async (req, res) => {
    try {
        await Customer.findOneAndUpdate({ _id: req.body.customerId }, req.body, { new: true });
        res.status(201).json('Customer Updated!');
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};

//for delete
export const deleteCustomerController = async (req, res) => {
    try {
        await Customer.findOneAndDelete({ _id: req.body.customerId });
        res.status(200).json('Customer Deleted!');
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};

//for seeds
// export const seedsCustomerController = async (req, res) => {
//     try {
//         const data = await Customer.insertMany(customers);
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(400).send(error);
//         console.log(error);
//     }
// };
