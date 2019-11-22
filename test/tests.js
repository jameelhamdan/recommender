process.env.NODE_ENV = 'test';
let app = require('../app');
let chaiHttp = require('chai-http');
var chai = require('chai')
    chai.use(chaiHttp);

let should = chai.should();
var expect = chai.expect;

const path = require('path');
const utils = require('../utils.js');
const dummy = require('../test/dummy.js');

// MAKE SURE THIS IS A TEST DATABASE AS IT WILL DELETE EVERYTHING
const neo4j_test_host = 'bolt://localhost:7687';
const neo4j_test_username = 'neo4j';
const neo4j_test_password = '1234';

const Neode = require('neode');
const neode = new Neode(neo4j_test_host, neo4j_test_username, neo4j_test_password, true)
    .withDirectory(path.join(__dirname, '../models'));

describe('Database', function () {
    it('Database Connection', function (done) {

        neode.cypher('CALL db.indexes();', {})
            .then(res => {
                done();
            })
            .catch((e) => {
                done(new Error("Database Connection Error"));
            });
    });

    it('Database Schema Initialization', function (done) {
        utils.init_neo4j(neode)
            .then(() => {
                done();
            })
            .catch((e) => {
                done(new Error('Neo4j Schema installation Failed! => \n ' + e.stack));
            });
    });

    it('Check if extensions are installed', function (done) {
        const query = `RETURN algo.similarity.jaccard([1], [1])`;

        neode.cypher(query, {})
            .then(res => {
                done();
            })
            .catch((e) => {
                done(new Error("Extension APOC is not installed!"));
            });
    });

    it('Clean database', function (done) {
        const query = `MATCH (n) DETACH DELETE n`;

        neode.cypher(query, {})
            .then(res => {
                done();
            })
            .catch((e) => {
                done(new Error("Couldn't clean database!"));
            });
    });

});

describe('Users APIs', function() {
    var list = dummy.users;
    // Adding test data
    list.forEach(function(item, index) {
        it(`Add User #${index} API`, function(done){
            chai.request(app)
                .post('/users/add/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    list.forEach(function(item, index) {
        it(`Find User #${index} API`, function(done){
            chai.request(app)
                .get('/users/find/')
                .send({'uuid' : item.uuid })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    it(`List Users API`, function(done){
        chai.request(app)
            .get('/users/list/')
            .send({'limit': '99999'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(list.length);
                done();
            });
    });

    list.forEach(function(item, index) {
        it(`Update User #${index} API`, function(done){
            chai.request(app)
                .post('/users/update/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});


describe('Promotions APIs', function() {
    var list = dummy.promotions;
    // Adding test data
    list.forEach(function(item, index) {
        it(`Add Promotion #${index} API`, function(done){
            chai.request(app)
                .post('/promotions/add/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    list.forEach(function(item, index) {
        it(`Find Promotion #${index} API`, function(done){
            chai.request(app)
                .get('/promotions/find/')
                .send({'uuid' : item.uuid })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    it(`List Promotions API`, function(done){
        chai.request(app)
            .get('/promotions/list/')
            .send({'limit': '99999'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(list.length);
                done();
            });
    });

    list.forEach(function(item, index) {
        it(`Update Promotions #${index} API`, function(done){
            chai.request(app)
                .post('/promotions/update/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});


describe('Categories APIs', function() {
    var list = dummy.categories;
    // Adding test data
    list.forEach(function(item, index) {
        it(`Add Category #${index} API`, function(done){
            chai.request(app)
                .post('/categories/add/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    list.forEach(function(item, index) {
        it(`Find Category #${index} API`, function(done){
            chai.request(app)
                .get('/categories/find/')
                .send({'uuid' : item.uuid })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    it(`List Category API`, function(done){
        chai.request(app)
            .get('/categories/list/')
            .send({'limit': '99999'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(list.length);
                done();
            });
    });

    list.forEach(function(item, index) {
        it(`Update Category #${index} API`, function(done){
            chai.request(app)
                .post('/categories/update/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});


describe('Stores APIs', function() {
    var list = dummy.stores;
    // Adding test data
    list.forEach(function(item, index) {
        it(`Add Store #${index} API`, function(done){
            chai.request(app)
                .post('/stores/add/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    list.forEach(function(item, index) {
        it(`Find Store #${index} API`, function(done){
            chai.request(app)
                .get('/stores/find/')
                .send({'uuid' : item.uuid })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    it(`List Store API`, function(done){
        chai.request(app)
            .get('/stores/list/')
            .send({'limit': '99999'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(list.length);
                done();
            });
    });

    list.forEach(function(item, index) {
        it(`Update Store #${index} API`, function(done){
            chai.request(app)
                .post('/stores/update/')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});
