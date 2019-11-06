const express = require('express');
const session = require('express-session');
const path = require('path');

const neode = require('neode')
    .fromEnv()
    .withDirectory(path.join(__dirname, 'models'));

const app = express();

app.use(session({
    genid: function() {
        return require('uuid').v4();
    },
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY || 'very_secret_key'
}));

app.use(require('./routes/api')(neode));

app.listen(3000, function () {
    console.log('app listening on http://localhost:3000');
});
