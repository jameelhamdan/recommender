const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const path = require('path');

const neode = require('neode')
    .fromEnv()
    .withDirectory(path.join(__dirname, 'models'));

const utils = require('./utils');

const app_port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use(require('./routes/api')(neode));

app.listen(app_port, async () => {
    // await neode.schema.drop().then(() => console.log('Neo4j Schema Dropped!'));
    await utils.init_neo4j(neode)
        .then(() => console.log('Neo4j Schema Initialization Successfully!'))
        .catch((e) => console.error('Neo4j Schema installation Failed! => \n ' + e.stack));

    console.log(`app listening on http://localhost:${app_port}`);

});
