/**
 * Created by i on 7/30/15.
 */
require("should");
var testObj = require("../method/usersHandler.js");
var request = require('supertest');

var res = {};
res.json = function(str){str.should.equal("hello");}


describe('Get /users',function(){
    //it('Get HeadPicture Url',function(done){
    //    var data = {"username":1};
    //    request('http://localhost:3000/users/')
    //        .post('headPicture')
    //        //.set('Accept','application/json')
    //        .type("form")
    //        .send({username:1})
    //        .expect('Content-Type',/json/)
    //        .expect("data",done);
    //});
    //
    //it("Get product list",function(done){
    //    var data = {index:1};
    //    request('http://localhost:3000/users/')
    //        .post("list")
    //        .type("form")
    //        .send(data)
    //        .expect('Content-Type',/json/)
    //        .expect("data",done);
    //})

    it("getCode",function(done){
        var data = {account : 1};
        request('http://localhost:3000/users')
            .post('/getCode')
            .type('form')
            .send(data)
            .expect("Content-Type",/json/)
            .expect("data",done);
    });

    it("forgetPassword", function (done) {
        var data = {username: "1", password: "123", code: 111};
        request("http://localhost:3000/users")
            .post('/forgetPassword')
            .type("form")
            .send(data)
            .expect("Content-Type",/json/)
            .expect("data",done);

    });
});
