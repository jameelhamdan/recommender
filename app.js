const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const path = require('path');

const neode = require('neode')
    .fromEnv()
    .withDirectory(path.join(__dirname, 'models'));

const app_port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use(require('./routes/api')(neode));

app.listen(app_port, async () => {
    console.log(`app listening on http://localhost:${app_port}`);

    neode.schema.install()
        .then(() => console.log('Neo4j Schema installed!'))
        .catch((e) => console.log('Neo4j Schema installation Failed! => \n ' + e.stack))
});
