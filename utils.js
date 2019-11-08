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
    datetime_now: function () {
        return new Date().getTime();
    }
};
