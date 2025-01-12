import User from '../models/userModel.js';

//for login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: 'Login Failed!',
                user,
            });
        } else if (user?.password !== password) {
            res.status(400).json({
                message: 'Password Not Match!',
            });
        } else {
            delete user?.password;
            res.status(200).send({
                message: 'Login Successfully!',
                user,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//for register
export const registerController = async (req, res) => {
    try {
        const newUser = new User({ ...req.body, verified: true });
        await newUser.save();
        res.status(200).send('New User Added Successfully!');
    } catch (error) {
        console.log(error);
    }
};
