const neo4j_error_name = 'Neo4jError';
const neo4j_error_messages = {
    'Neo.ClientError.Schema.ConstraintValidationFailed': 'Constraint Validation Failed',
};

module.exports = {
    init_neo4j: async function (neode) {
        //Add Unique Constraint on tables
        const model_name_array = ['Category', 'CategoryGroup', 'Mall', 'Promotion', 'Store', 'User'];

        const queries = [];
        model_name_array.forEach((model_name) => {
            queries.push({'query': `CREATE CONSTRAINT ON (model:${model_name}) ASSERT model.uuid IS UNIQUE`});
        });

        await neode.batch(queries);
        await neode.schema.install();
    },
    handle_neo4j_exception: async function(res, e){
        if (typeof e.name !== 'undefined' && typeof e.code !== 'undefined' && e.name === neo4j_error_name){
            const error_message = neo4j_error_messages[e.code];
            if(typeof error_message !== 'undefined'){

                return res.status(400).send({'errors': error_message})
            }
        }

        return res.status(500).send(e.stack);
    },
    validate_input: async function(body, parse_fields=[]){
        const errors = [];
        const properties = {};

        if (parse_fields.length === 0) {
            errors.push('No values to parse provided');
            return errors;
        }

        for (const index in parse_fields) {
            const field = parse_fields[index];
            const value = body[field];
            if (typeof value === 'undefined' || value.length === 0) {
                errors.push({field: `Invalid Value : '${value}'`});
            }

            properties[field] = body[field];
        }
        return {
            'properties': properties,
            'errors': errors,
        }
    },
    datetime_now: function () {
        return new Date().getTime();
    },
};
