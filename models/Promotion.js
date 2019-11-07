module.exports = {
    labels: ['Promotion'],
    'id': {
        type: 'uuid',
        index: true,
        primary:true,
        required: true,
    },
    'uuid': {
        type: 'uuid',
        index: true,
        primary:true,
        required: true,
    },
    'name':{
        type:'string',
        required: true,
    },
    'created_at': 'datetime',
    'updated_at': 'datetime',

    in_category: {
        type: "relationship",
        target: "Category",
        relationship: "IN_CATEGORY",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    promoted_by_store: {
        type: "relationship",
        target: "Store",
        relationship: "PROMOTED_BY",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    promoted_by_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "PROMOTED_BY",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    }
};
