const utils = require('../utils');

module.exports = {
    labels: ['Promotion'],
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
    promoted_by_store: {
        type: "relationship",
        target: "Store",
        relationship: "PROMOTED_BY",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    promoted_by_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "PROMOTED_BY",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    }
};
