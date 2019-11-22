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

    router.get('/users/recommended_promotions/', async (req, res) => {
        await functions.recommended_promotions(neode, req, res);
    });

    router.get('/users/list/', async (req, res) => {
        await functions.list(neode, req, res, 'User',);
    });

    router.get('/users/find/', async (req, res) => {
        await functions.find(neode, req, res, 'User',);
    });

    router.post('/users/add/', async (req, res) => {
        const add_fields = ['uuid', 'name'];
        await functions.add(neode, req, res, 'User', add_fields);
    });

    router.post('/users/update/', async (req, res) => {
        const update_fields = ['name'];
        await functions.update(neode, req, res, 'User', update_fields);
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

    router.post('/users/add_promotion_like/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'User', 'Promotion',  'liked', );
    });

    router.post('/users/add_category_interest/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'User', 'Category',  'interested_in');
    });

    router.post('/users/bookmark_store/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'User', 'Store',  'bookmarked_store');
    });

    router.post('/users/bookmark_mall/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'User', 'Mall',  'bookmarked_mall');
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
        const add_fields = ['uuid', 'name'];
        await functions.add(neode, req, res, 'Promotion', add_fields);
    });

    router.post('/promotions/update/', async (req, res) => {
        const update_fields = ['name'];
        await functions.update(neode, req, res, 'Promotion', update_fields);
    });

    router.post('/promotions/remove/', async (req, res) => {
        await functions.remove(neode, req, res, 'Promotion',);
    });

    router.post('/promotions/add_to_category/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'Promotion', 'Category',  'in_category');
    });

    router.post('/promotions/add_to_store/', async (req, res) => {
        await functions.add_relationship(neode, req, res,'Promotion', 'Store',  'promoted_by_store');
    });

    router.get('/promotions/users_reached/', async (req, res) => {
        await functions.list_related(neode, req, res,'Promotion', 'User', 'VIEWED', 'IN');
    });


    // ======
    // Categories
    // ======

    router.get('/categories/list/', async (req, res) => {
        await functions.list(neode, req, res, 'Category',);
    });

    router.get('/categories/find/', async (req, res) => {
        await functions.find(neode, req, res, 'Category',);
    });

    router.post('/categories/add/', async (req, res) => {
        const add_fields = ['uuid', 'name'];
        await functions.add(neode, req, res, 'Category', add_fields);
    });

    router.post('/categories/update/', async (req, res) => {
        const update_fields = ['name'];
        await functions.update(neode, req, res, 'Category', update_fields);
    });

    router.post('/categories/remove/', async (req, res) => {
        await functions.remove(neode, req, res, 'Category',);
    });

    router.get('/categories/promotions/', async (req, res) => {
        await functions.list_related(neode, req, res,'Category', 'Promotion', 'IN_CATEGORY', 'IN');
    });

    // ======
    // Stores
    // ======

    router.get('/stores/list/', async (req, res) => {
        await functions.list(neode, req, res, 'Store',);
    });

    router.get('/stores/find/', async (req, res) => {
        await functions.find(neode, req, res, 'Store',);
    });

    router.post('/stores/add/', async (req, res) => {
        const add_fields = ['uuid', 'name', 'location'];
        await functions.add(neode, req, res, 'Store', add_fields);
    });

    router.post('/stores/update/', async (req, res) => {
        const update_fields = ['name'];
        await functions.update(neode, req, res, 'Store', update_fields);
    });

    router.post('/stores/remove/', async (req, res) => {
        await functions.remove(neode, req, res, 'Store',);
    });

    router.get('/stores/promotions/', async (req, res) => {
        await functions.list_related(neode, req, res,'Store', 'Promotion', 'PROMOTED_BY', 'IN');
    });

    return router;
};
