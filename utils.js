const neo4j_error_name = 'Neo4jError';
const neo4j_error_messages = {
    "Neo.ClientError.Schema.ConstraintValidationFailed": "Constraint Validation Failed",
    "ObjectNotFound": "Object '{object_name}' Not Found",

};

class CustomError {
    constructor(message, error_name, error_code, error_value='') {
        this.message = message;
        this.name = error_name;
        this.code = error_code;
        this.value = error_value;
    }
}

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
    throw_neo4j_not_found_error: function(object_name){
        throw new CustomError('Object Doesn\'t Exist', 'Neo4jError', 'ObjectNotFound', object_name);
    },
    handle_neo4j_exception: async function(res, e){
        if (typeof e.name !== 'undefined' && typeof e.code !== 'undefined' && e.name === neo4j_error_name){
            const error_message = neo4j_error_messages[e.code];

            if(e.code === 'ObjectNotFound'){
                const message = error_message.replace('{object_name}', e.value);

                return res.status(404).send({'errors': message })
            }

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
                const error = {};
                error[field] = `Empty Value`;
                errors.push(error);
            }

            properties[field] = body[field];
        }
        return {
            'properties': properties,
            'errors': errors,
        }
    },
    datetime_now: function () {
        return Date.now()
    },
    hydrateRelationship: function(result, definition){
        let list = result.records;
        let json_list = [];
        for(let i=0;i<list.length;i++){
            let props = list[i]._fields[0].properties;

            Object.keys(props).forEach(function(key) {
                if(props[key].__proto__.__isDateTime__===true){
                    props[key] = new Date(props[key]);
                }
            });

            json_list.push(props)
        }

        return json_list
    }
};
