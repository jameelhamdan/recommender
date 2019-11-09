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
                utils.handle_neo4j_exception(res, e);
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
                utils.handle_neo4j_exception(res, e);
            });
    },
    create: async function (neode, req, res, model, parse_fields = []) {
        const validated_input = utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        neode.create(model, properties)
            .then(res => {
                return res.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch((e) => {
                utils.handle_neo4j_exception(res, e);
            });
    },
    update: async function (neode, req, res, model, parse_fields = []) {
        const id_value = req.body.uuid;
        const validated_input = await utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        neode.find(model, id_value)
            .then(async (obj) => {
                await obj.update(properties);
                return obj.toJson();
            })
            .then(json => {
                res.send(json);
            })
            .catch(e => {
                utils.handle_neo4j_exception(res, e);
            });
    }
};
