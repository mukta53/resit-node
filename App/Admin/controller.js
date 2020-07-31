const AdminModel = require('./model');
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
        let token = "", admin = {};
        const existingAccount = await AdminModel.findOne({email: email}).count();
        if ( existingAccount > 0) {
            return res.status(409).json({
                status: "Error",
                errEmail: "Email already taken."
            });
        }
        admin = await AdminModel.create({
            name: name,
            email: email,
            password: password
        });
        token = jwt.sign({ _id: admin.id.toString() },
            process.env.TOKEN_SECRET,
            { expiresIn: "7 days" }
        );
        await AdminModel.updateOne({_id: admin.id},{
            token: token
        });
        admin = await AdminModel.findOne({_id: admin.id}, {password: 0});
        return res.status(200).json({
            status: "Successful!",
            message: "Successfully Registered as an admin",
            data: admin
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
        let admin = await AdminModel.findOne({ email: email});
        if ( !admin ) {
            return res.status(409).json({
                status: "Error",
                errEmail: "Email is not correct."
            });
        }
        else {
            let isMatch = await admin.comparePassword(password);
            if ( !isMatch ) {
                return res.status(409).json({
                    status: "Error",
                    errPassword: "Incorrect Password"
                });
            }
            else {
                token = jwt.sign({ _id: admin.id.toString() },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "7 days" }
                );
                await AdminModel.update({_id: admin.id}, {
                    token: token
                });
                admin.token = token;
                admin.password = undefined;
                return res.status(200).json({
                    status: "Successful",
                    message: "Successfully Logged In",
                    data: admin
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
  }
}