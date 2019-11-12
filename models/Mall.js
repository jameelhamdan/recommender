const utils = require('../utils');

module.exports = {
    labels: ['Mall'],
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
    location: 'point',

    in_category: {
        type: "relationship",
        target: "Category",
        relationship: "IN_CATEGORY",
        direction: "out",
        properties: {
            uuid: {
                type: 'uuid',
            },
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            }
        }
    },
};
