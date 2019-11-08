const utils = require('../utils');

module.exports = {
    labels: ['Category'],
    uuid: {
        type: 'uuid',
        primary:true,
    },
    name:{
        type:'string',
        required: true,
    },
    created_at: {
        type: 'datetime',
        default: utils.datetime_now()
    },
    updated_at: {
        type: 'datetime',
        default: utils.datetime_now()
    },

    in_group: {
        type: "relationship",
        target: "CategoryGroup",
        relationship: "IN_GROUP",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            }
        }
    }
};
