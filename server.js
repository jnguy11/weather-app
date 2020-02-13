const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const verify = require('./routes/tokenVerify');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db')
);

app.use(express.json()); // Allows you to send post requests


app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile("./index.html")
});

app.post('/registers', authRoute, function (req, res) {
    res.sendFile("./public/index.html", { root: __dirname })
});

app.post('/logins', authRoute, function (req, res) {

    res.sendFile('./private/app.html', { root: __dirname });
});

// app.use("/auth", authRoute);

app.listen(4000, () => console.log('Server is running'));
