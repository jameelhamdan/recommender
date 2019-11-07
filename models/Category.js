const utils = require('../utils');

module.exports = {
    labels: ['Category'],
    id: {
        type: 'uuid',
        index: true,
        primary:true,
        required: true,
    },
    uuid: {
        type: 'uuid',
        index: true,
        primary:true,
        required: true,
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
