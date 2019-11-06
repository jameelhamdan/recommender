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
};
