const utils = require('../utils');

module.exports = {
    labels: ['User'],
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

    interested_in: {
        type: "relationship",
        target: "Category",
        relationship: "INTERESTED_IN",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    liked: {
        type: "relationship",
        target: "Promotion",
        relationship: "LIKED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    viewed_promotion: {
        type: "relationship",
        target: "Promotion",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    viewed_store: {
        type: "relationship",
        target: "Store",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    viewed_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    bookmarked_store: {
        type: "relationship",
        target: "Store",
        relationship: "BOOKMARKED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    },
    bookmarked_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "BOOKMARKED",
        direction: "out",
        properties: {
            created_at: {
                type: 'datetime',
                default: utils.datetime_now()
            },
        }
    }
};
