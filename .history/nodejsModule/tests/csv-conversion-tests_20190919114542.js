const expect = require('chai').expect;
const should = require('chai').should;
const assert = require('chai').assert;

const CsvProcessor = require('../nodejsModule/CsvProcessor.js');
const $processor = new CsvProcessor();

describe('landing-page', ()=>{
    it('should GET a simple greeting', (done)=>{
        chai.request(server)
        .get('/')
        .end(($err,$res)=>{
            //console.log($res);
            ($res).should.have.status(200);
            ($res.body).should.be.a('object');
            done();
        });
    });
});