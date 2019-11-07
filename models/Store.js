const utils = require('../utils');

module.exports = {
    labels: ['Store'],
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

    location: 'point',

    in_category: {
        type: "relationship",
        target: "Category",
        relationship: "IN_CATEGORY",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    is_in: {
        type: "relationship",
        target: "Mall",
        relationship: "IS_IN",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    }
};
