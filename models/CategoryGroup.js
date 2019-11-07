const utils = require('../utils');

module.exports = {
    labels: ['CategoryGroup'],
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
};
