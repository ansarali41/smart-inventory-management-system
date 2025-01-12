import Bills from '../models/billsModel.js';

//for add or fetch
export const getBillsController = async (req, res) => {
    try {
        const { createdBy } = req.query;
        if (!createdBy) {
            return res.status(400).json({ message: 'createdBy is required' });
        }

        const bills = await Bills.find({ createdBy });
        res.send(bills);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching bills' });
    }
};

//for add
export const addBillsController = async (req, res) => {
    try {
        const { createdBy } = req.body;
        if (!createdBy) {
            return res.status(400).json({ message: 'createdBy is required' });
        }

        const newBills = new Bills(req.body);
        await newBills.save();
        res.send('Bill Created Successfully!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating bill' });
    }
};
