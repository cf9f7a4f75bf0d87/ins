//require('should');
var  handler    = require('../method/usersHandler.js');
var request = require('supertest');
var express = require('express');
var tool = require('../method/tool.js');
var app = express();



tool.testAdapter(function(res){
    handler.introduce(res,1);
});

//
//describe('Get /user',function(){
//    it('response with json',function(done){
//        request('http://localhost:3000')
//            .get('/')
//            .set('Accept','application/json')
//            .expect('Content-Type',/json/)
//            .expect(200,done);
//    })
//});
//
//
//describe('Post /users/list',function(){
//    it('response with json',function(done){
//        request('http://localhost:3000')
//            .post('/users/introduce')
//            .field('productId',1)
//            .expect('Content-Type',/json/)
//            .expect('hehe',function(err){
//                if(err)console.log(err);
//                done();
//            });
//    })
//})
//
//var name = "zhaojian";
//
//describe("Name", function() {
//    it("The name should be zhaojian", function() {
//        name.should.eql("zhaojian");
//    });
//});
//
//var Person = function(name) {
//    this.name = name;
//};
//var zhaojian = new Person(name);
//
//describe("InstanceOf", function() {
//    it("Zhaojian should be an instance of Person", function() {
//        zhaojian.should.be.an.instanceof(Person);
//    });
//
//    it("Zhaojian should be an instance of Object", function() {
//        zhaojian.should.be.an.instanceof(Object);
//    });
//});
//describe("Property", function() {
//    it("Zhaojian should have property name", function() {
//        zhaojian.should.have.property("name");
//    });
//});
