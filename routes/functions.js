const utils = require('../utils');

module.exports = {
    list: async function (neode, req, res, model, params = {}) {
        const order_by = req.body.order || 'id';
        const sort = req.body.sort || 'ASC';
        const limit = req.body.limit || 10;
        const page = req.body.page || 1;
        const skip = (page - 1) * limit;

        const order = {[order_by]: sort};

        neode.all(model, params, order, limit, skip)
            .then(res => {
                return res.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch(e => {
                res.status(500).send(e.stack);
            });
    },
    find: async function (neode, req, res, model, params = {}) {
        const id_value = req.body.uuid;
        neode.find(model, id_value)
            .then(res => {
                return res.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch(e => {
                res.status(500).send(e.stack);
            });
    },
    create: async function (neode, req, res, model, parse_fields = []) {
        const properties = {};


        if (parse_fields.length === 0) {
            res.status(400).send({'error': 'No values to parse provided'});
        }

        // Add More Field Specific Validation
        const errors = [];
        for (const index in parse_fields) {
            const field = parse_fields[index];
            const value = req.body[field];
            if (typeof value === 'undefined' || value.length === 0) {
                errors.push({field: `Invalid Value : '${value}'`});
            }

            properties[field] = req.body[field];
        }

        if (errors.length > 0){
            res.status(400).send({'errors': errors });
            return
        }

        neode.create(model, properties)
            .then(res => {
                return res.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch(e => {
                res.status(500).send(e.stack);
            });
    }
};
