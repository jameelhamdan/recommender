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
        const parse_fields = ['uuid'];
        const validated_input = await utils.validate_input(req.body, parse_fields);
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

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
        parse_fields = parse_fields.push['uuid'];

        const validated_input = await utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        const id_value = req.body.uuid;

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
    remove: async function (neode, req, res, model) {
        const parse_fields = ['uuid'];
        const validated_input = await utils.validate_input(req.body, parse_fields);
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        const id_value = req.body.uuid;

        this.get_object(neode, res, model, id_value)
            .then(async (object) => {
                if (object === false) {
                    utils.throw_neo4j_not_found_error(model);
                }
                await object.delete();
                res.send({'message': `'${model}' with uuid : '${object.get('uuid')}' was removed`});
            });
    },
    recommended_promotions: async function (neode, req, res) {
        const parse_fields = ['uuid'];

        const validated_input = await utils.validate_input(req.body, parse_fields);
        const properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }


        const id_value = req.body.uuid;
        const limit = req.body.limit || 10;
        const page = req.body.page || 1;
        const skip = (page - 1) * limit;

        this.get_object(neode, res, 'User', id_value)
            .then(async (object) => {
                const query = `                                       
                    MATCH (u:User {uuid:"${object.get('uuid')}"}) WITH u AS user
                    
                    OPTIONAL MATCH (user)-[:INTERESTED_IN]->(interests:Category)
                    OPTIONAL MATCH (user)-[:BOOKMARKED]->(bookmarked) 
                    WITH user as user, collect(id(interests)) as interests_set, collect(id(bookmarked)) as bookmarked_set
                    
                    OPTIONAL MATCH (promotions:Promotion)
                    OPTIONAL MATCH (promotions)-[:IN_CATEGORY]->(categories:Category)
                    OPTIONAL MATCH (promotions)-[:PROMOTED_BY]->(promoters)
                                        
                    WITH 
                        promotions,
                        algo.similarity.jaccard(interests_set, collect(id(categories))) AS interest_similarity,
                        algo.similarity.jaccard(bookmarked_set, collect(id(promoters))) AS bookmarked_similarity
                       
                    WITH 
                        promotions,
                        (interest_similarity + bookmarked_similarity)/2 as similarity
                        
                    RETURN promotions, similarity ORDER BY similarity DESC SKIP ${skip} LIMIT ${limit} ;
                `;

                neode.cypher(query, {})
                    .then(async (result) => {
                        var json = await neode.hydrate(result, 'promotions').toJson();
                        for(var i=0;i< json.length;i++){
                            json[i]['similarity'] = result.records[i].get('similarity');
                        }

                        res.send(json);
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
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
                    MATCH (f:${from_model} {uuid : "${from_uuid}"})-[r:${relationship_db_name}]->(t:${to_model} {uuid : "${to_uuid}"})
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
    list_related: async function (neode, req, res, from_model, to_model, relationship_db_name, direction = "OUT", parse_fields = ['uuid']) {
        const validated_input = await utils.validate_input(req.body, parse_fields);

        const sort = req.body.sort || 'ASC';
        const limit = req.body.limit || 10;
        const page = req.body.page || 1;
        const skip = (page - 1) * limit;

        let properties = validated_input['properties'];
        const errors = validated_input['errors'];

        if (errors.length > 0) {
            res.status(400).send({'errors': errors});
            return
        }

        var from_dir_char = '-';
        var to_dir_char = '->';
        if (direction === 'OUT') {
            from_dir_char = '-';
            to_dir_char = '->';
        } else if (direction === 'IN') {
            from_dir_char = '<-';
            to_dir_char = '-';
        }

        let uuid = properties[parse_fields[0]];

        // Add Relationship to Database
        this.get_object(neode, res, from_model, uuid)
            .then(async (object) => {
                let from_uuid = object.get('uuid');
                const query = `
                    MATCH (f:${from_model} {uuid: "${from_uuid}"})${from_dir_char}[:${relationship_db_name}]${to_dir_char}(t:${to_model})
                    RETURN DISTINCT t ORDER BY t.uuid ${sort} SKIP ${skip} LIMIT ${limit};
                `;

                neode.cypher(query, {})
                    .then(async (result) => {
                        var json = await neode.hydrate(result, 't').toJson();
                        res.send(json);
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
            });

    },
    add_relationship: async function (neode, req, res, from_model, to_model, relationship_name, force = false, parse_fields = ['from_uuid', 'to_uuid']) {
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
                from_object.relateTo(to_object, relationship_name, {}, force)
                    .then(relationship => {
                        const relationship_uuid = relationship.get('uuid');
                        res.send({'relationship_uuid': relationship_uuid})
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
            });

    },
    remove_relationship_between: async function (neode, req, res, from_model, to_model, relationship_db_name, parse_fields = ['from_uuid', 'to_uuid']) {
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
                    MATCH (f:${from_model} {uuid : "${from_uuid}"})-[r:${relationship_db_name}]->(t:${to_model} {uuid : "${to_uuid}"})
                    DELETE r
                    WITH count(r) as c
                    RETURN c;
                `;

                neode.cypher(query, {})
                    .then(result => {
                        var count = result.records[0].get('c').toInt();
                        res.send({'message': `Removed ${count} relationships!`});
                    })
                    .catch(e => {
                        utils.handle_neo4j_exception(res, e);
                    });
            });

    },
};
