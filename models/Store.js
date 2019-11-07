module.exports = {
    labels: ['Store'],
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
    'location': 'point',
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
    is_in: {
        type: "relationship",
        target: "Mall",
        relationship: "IS_IN",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    }
};
