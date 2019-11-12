const utils = require('../utils');

module.exports = {
    get_object: async function (neode, res, model, id_value) {
        return neode.find(model, id_value)
            .then(async (object) => {
                if (object === false) {
                    utils.throw_neo4j_not_found_error(model);
                }
                return object;
            })
            .catch(e => {
                utils.handle_neo4j_exception(res, e);
            });
    },
    list: async function (neode, req, res, model, params = {}) {
        const order_by = req.body.order || 'id';
        const sort = req.body.sort || 'ASC';
        const limit = req.body.limit || 10;
        const page = req.body.page || 1;
        const skip = (page - 1) * limit;

        const order = {[order_by]: sort};

        neode.all(model, params, order, limit, skip)
            .then(async (list) => {
                const json = await list.toJson();
                res.send(json);
            })
            .catch(e => {
                utils.handle_neo4j_exception(res, e);
            });
    },
    find: async function (neode, req, res, model) {
        const id_value = req.body.uuid;
        this.get_object(neode, res, model, id_value)
            .then(async (object) => {
                const json = await object.toJson();
                res.send(json);
            })

    },
    add: async function (neode, req, res, model, parse_fields = []) {
        const validated_input = await utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        neode.create(model, properties)
            .then(async (object) => {
                const json = await object.toJson();
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

        this.get_object(neode, res, model, id_value)
            .then(async (object) => {
                if (object === false) {
                    utils.throw_neo4j_not_found_error(model);
                }
                await object.update(properties);
                const json = await object.toJson();
                res.send(json);
            })
    },
    list_relationship_between: async function (neode, req, res, from_model, to_model, relationship_db_name, parse_fields = ['from_uuid', 'to_uuid']) {
        const validated_input = await utils.validate_input(req.body, parse_fields);
        let properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }
        let from_uuid = properties[parse_fields[0]];
        let to_uuid = properties[parse_fields[1]];

        // Add Relationship to Database
        Promise.all([
            this.get_object(neode, res, from_model, from_uuid),
            this.get_object(neode, res, to_model, to_uuid)
        ])
            .then(async ([from_object, to_object]) => {
                let from_uuid = from_object.get('uuid');
                let to_uuid = to_object.get('uuid');
                const query = `
                    MATCH (f:${from_model})-[r:${relationship_db_name}]->(t:${to_model})
                    WHERE f.uuid = "${from_uuid}" AND t.uuid = "${to_uuid}" 
                    RETURN r;
                `;

                neode.cypher(query, {})
                    .then(result => {

                        res.send(utils.hydrateRelationship(result));
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
            });

    },
    add_relationship: async function (neode, req, res, from_model, to_model, relationship_name, force=false, parse_fields = ['from_uuid', 'to_uuid']) {
        const validated_input = await utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }
        var from_uuid = properties[parse_fields[0]];
        var to_uuid = properties[parse_fields[1]];

        // Add Relationship to Database
        Promise.all([
            this.get_object(neode, res, from_model, from_uuid),
            this.get_object(neode, res, to_model, to_uuid)
        ])
            .then(([from_object, to_object]) => {
                from_object.relateTo(to_object, relationship_name, {},force)
                    .then(relationship => {
                        const relationship_uuid = relationship.get('uuid');
                        res.send({'relationship_uuid': relationship_uuid})
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
            });

    }
};
