const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://a74cbeb34c6c464f998ba98c08226192@sentry.io/3005799' });

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db')
);

app.use(Sentry.Handlers.requestHandler());

app.use(express.json()); // Allows you to send post requests


app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + "/public"));
/**
 * @api {get} "./"  get the default localhost
 * @apiName default
 * @apiGroup default port
 *
 * @apiParam :4000
 *
 * @apiSuccess requires :4000 after localhost
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     will response with serving the ./index.html file
 * when successful

 */
app.get("/", (req, res) => {
    res.sendFile("./index.html")
});

app.post('/registers', authRoute, function (req, res) {
    res.sendFile("./public/index.html", { root: __dirname });
    
});

app.post('/logins', authRoute, function (req, res) {

    res.sendFile('./private/app.html', { root: __dirname });
});

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
  });

app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.listen(4000, () => console.log('Server is running'));
