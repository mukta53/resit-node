const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const mongoose = require('mongoose');
const environment = require('dotenv');
const cors = require('cors');

const Admin = require('./App/Admin/routes');

environment.config();

const app = express();

app.options('*', cors());
app.use(cors());

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
}
run();

app.use(morganLogger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 3600000 }
}));

app.use('/api/admin', Admin);

app.use(function (err, req, res, next) {
  if(err.message)
    res.status(404).json({ status: "Error", message: err.message});
  else if (err.status === 404)
    res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({ message: "Something looks wrong :( !!!"});
});

app.listen(process.env.PORT || 4200, function () {
    console.log('Node server listening on port 4200');
});