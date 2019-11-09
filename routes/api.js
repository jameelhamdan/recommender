/**
 *
 * app.use(require('./routes/api')(neode));
 *
 * @param {Neode} neode  Neode instance
 * @return {Router}      Express router
 */
module.exports = function (neode) {
    const router = require('express').Router();
    const functions = require('../routes/functions');

    // ======
    // User
    // ======
    router.get('/users/list/', async (req, res) => {
        await functions.list(neode, req, res, 'User',);
    });

    router.get('/users/find/', async (req, res) => {
        await functions.find(neode, req, res, 'User',);
    });

    router.post('/users/create/', async (req, res) => {
        const user_fields = ['uuid', 'name'];
        await functions.create(neode, req, res, 'User', user_fields);
    });

    router.post('/users/update/', async (req, res) => {
        const user_fields = ['name'];
        await functions.update(neode, req, res, 'User', user_fields);
    });

    return router;
};
