/**
 *
 * app.use(require('./routes/api')(neode));
 *
 * @param {Neode} neode  Neode instance
 * @return {Router}      Express router
 */
module.exports = function(neode) {
    const router = require('express').Router();

    router.get('/', async (req, res) => {
        neode.all('User')
            .then(res => {
                return res.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch(e => {
                res.status(500).send(e.stack);
            });
    });

    return router;
};
