const UsersModel = require('./model');
const jwt = require('jsonwebtoken');
const environment = require('dotenv');

environment.config();

module.exports = {
  Create: async (req, res) => {
    try {
        let {
            name,
            email,
            password
        } = req.body;
        let token = "", user = {};
        const existingAccount = await UsersModel.findOne({email: email}).count();
        if ( existingAccount > 0) {
            return res.status(409).json({
                status: "Error",
                errorEmail: "Email already taken."
            });
        }
        user = await UsersModel.create({
            name: name,
            email: email,
            password: password
        });
        token = jwt.sign({ _id: user.id.toString() },
            process.env.TOKEN_SECRET,
            { expiresIn: "7 days" }
        );
        await UsersModel.updateOne({_id: user.id},{
            token: token
        });
        user = await UsersModel.findOne({_id: user.id}, {password: 0});
        return res.status(200).json({
            status: "Successful!",
            message: "Successfully Registered as an user",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  },
  Login: async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UsersModel.findOne({ email: email});
        if ( !user ) {
            return res.status(409).json({
                status: "Error",
                errEmail: "Email is not correct."
            });
        }
        else {
            let isMatch = await user.comparePassword(password);
            if ( !isMatch ) {
                return res.status(409).json({
                    status: "Error",
                    errPassword: "Incorrect Password"
                });
            }
            else {
                token = jwt.sign({ _id: user.id.toString() },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "7 days" }
                );
                await UsersModel.update({_id: user.id}, {
                    token: token
                });
                user.token = token;
                user.password = undefined;
                return res.status(200).json({
                    status: "Successful",
                    message: "Successfully Logged In",
                    data: user
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  },
  List: async ( req, res ) => {
    try {
        let users = [];
        users = await UsersModel.find({}, {password: 0});
        return res.status(200).json({
            status: "Successful",
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  }
}