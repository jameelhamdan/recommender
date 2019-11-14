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

    router.post('/users/add/', async (req, res) => {
        const user_fields = ['uuid', 'name'];
        await functions.add(neode, req, res, 'User', user_fields);
    });

    router.post('/users/update/', async (req, res) => {
        const user_fields = ['name'];
        await functions.update(neode, req, res, 'User', user_fields);
    });

    router.post('/users/remove/', async (req, res) => {
        await functions.remove(neode, req, res, 'User',);
    });

    router.get('/users/list_promotion_view/', async (req, res) => {
        await functions.list_relationship_between(neode, req, res,'User', 'Promotion',  'VIEWED', );
    });

    router.post('/users/add_promotion_view/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'User', 'Promotion',  'viewed_promotion', true);
    });

    router.post('/users/remove_promotion_views/', async (req, res) => {
        await functions.remove_relationship_between(neode, req, res,'User', 'Promotion',  'VIEWED');
    });

    router.get('/users/viewed_promotions/', async (req, res) => {
        await functions.list_related(neode, req, res,'User', 'Promotion',  'VIEWED');
    });

    // ======
    // Promotion
    // ======
    router.get('/promotions/list/', async (req, res) => {
        await functions.list(neode, req, res, 'Promotion',);
    });

    router.get('/promotions/find/', async (req, res) => {
        await functions.find(neode, req, res, 'Promotion',);
    });

    router.post('/promotions/add/', async (req, res) => {
        const promotion_fields = ['uuid', 'name'];
        await functions.add(neode, req, res, 'Promotion', promotion_fields);
    });

    router.post('/promotions/update/', async (req, res) => {
        const promotion_fields = ['name'];
        await functions.update(neode, req, res, 'Promotion', promotion_fields);
    });

    router.post('/promotions/remove/', async (req, res) => {
        await functions.remove(neode, req, res, 'Promotion',);
    });

    router.get('/promotions/users_reached/', async (req, res) => {
        await functions.list_related(neode, req, res,'Promotion', 'User', 'VIEWED', 'IN');
    });

    return router;
};
