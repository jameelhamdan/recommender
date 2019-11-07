module.exports = {
    labels: ['User'],
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

    interested_in: {
        type: "relationship",
        target: "Category",
        relationship: "INTERESTED_IN",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    liked: {
        type: "relationship",
        target: "Promotion",
        relationship: "LIKED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    viewed_promotion: {
        type: "relationship",
        target: "Promotion",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    viewed_store: {
        type: "relationship",
        target: "Store",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    viewed_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "VIEWED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    bookmarked_store: {
        type: "relationship",
        target: "Store",
        relationship: "BOOKMARKED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    },
    bookmarked_mall: {
        type: "relationship",
        target: "Mall",
        relationship: "BOOKMARKED",
        direction: "out",
        properties: {
            created_at: 'datetime',
        }
    }
};
