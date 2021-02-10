require('dotenv').config()
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.REACT_APP_SEVER_PORT || 4000;

var fetch = require('node-fetch');
var SECRET_KEY_V3 = process.env.SECRET_KEY_V3;
var SECRET_KEY_V2 = process.env.SECRET_KEY_V2;

// enable CORS using npm package
var cors = require('cors');
app.use(cors());

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// request handlers
app.get('/', (req, res) => {
    res.status(200).json({ message: 'recaptcha test' });
});

// verify reCAPTCHA response
app.post('/verify', (req, res) => {
    var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY_V3}&response=${req.body['g-recaptcha-response']}`;
    return fetch(VERIFY_URL, { method: 'POST' })
        .then(res => res.json())
        .then(json => res.send(json));
});

app.listen(port, () => {
    console.log('Server started on: ' + port);
});
