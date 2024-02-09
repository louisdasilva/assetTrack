const { expect } = require("chai");
const request = require("request");

const ioMock = {
    on: () => {},
    emit: () => {},
};
global.io = () => ioMock;

describe("API TEST SUITE \n ----------------", function(){
    let url = 'http://localhost:3000/api/part';
    let partID = [];

    const VALID_PARTS = [
        { partName: 'Wing', partFamily: 'wing', partNumber: 'wing-0', partPath: 'wing.jpg', description: 'This is a description' },
        { partName: 'Window', partFamily: 'fuselage', partNumber: 'window-0', partPath: 'window.jpg', description: 'This is a description' },
        { partName: 'Tail', partFamily: 'tail', partNumber: 'tail-0', partPath: 'tail.jpg', description: 'This is a description' },
        { partName: 'Engine', partFamily: 'engine', partNumber: 'engine-0', partPath: 'engine.jpg', description: 'This is a description' },
        { partName: 'Tube', partFamily: 'landing gear', partNumber: 'tube-0', partPath: 'tube.jpg', description: 'This is a description' },
        { partName: 'Panel', partFamily: 'cockpit', partNumber: 'panel-0', partPath: 'cockpit.jpg', description: 'This is a description' },
    ];

    const INVALID_PARTS = [
        { partName: 'Invalid', partFamily: 'tree', partNumber: 'wing-0', partPath: 'wing.jpg', description: 'This is a description' },
        { partName: 'Empty', partFamily: '', partNumber: 'window-0', partPath: 'window.jpg', description: 'This is a description' },
        { partName: 'Null', partFamily: 'null', partNumber: 'tail-0', partPath: 'tail.jpg', description: 'This is a description' },
        { partName: 'Undefined', partFamily: 'undefined', partNumber: 'engine-0', partPath: 'engine.jpg', description: 'This is a description' },
    ];


    describe('GET Parts', function(){
        it('Connection Success (200)', function(done){
            request(url+"s", function(error, response, body){
                let responseObj = JSON.parse(body);
                expect(responseObj.statusCode).to.equal(200);
                done();
            });
        });
        it('Returns an Object', function(done){
            request(url+"s", function(error, response, body){
                let responseObj = JSON.parse(body);
                expect(responseObj).to.be.an('object');
                done();
            });
        });
        it('Total Part Count Matches Expected', function(done){
            request(url+"s", function(error, response, body){
                let responseObj = JSON.parse(body);
                expect(responseObj.data.length).to.equal(3);
                done();
            });
        });
    });

    describe('POST Part', function(){
        for (let i=0; i < VALID_PARTS.length; i++) {       
            it('POST '+ VALID_PARTS[i].partName +' (201)', function(done){
                request.post({url,form:VALID_PARTS[i]}, function(error, response, body){
                    let responseObj = JSON.parse(body);
                    partID[i] = responseObj.data._id;
                    // console.log(partID[i]);
                    expect(responseObj.statusCode).to.equal(201);
                    done();
                });
            });       
        }
        // partID = {};
        for (let i=0; i < INVALID_PARTS.length; i++) {   
            it('POST '+ INVALID_PARTS[i].partName +' partFamily (400)', function(done){
                request.post({url,form:INVALID_PARTS[i]}, function(error, response, body){
                    let responseObj = JSON.parse(body);
                    // partID[i] = responseObj.data._id;
                    expect(responseObj.statusCode).to.equal(400);
                    done();
                });
            });   
        }   
    }); 

    describe('UPDATE Part', function(){
        for (let i=0; i < VALID_PARTS.length; i++) {       
            it('UPDATE '+ VALID_PARTS[i].partName +' (200)', function(done){
                const updatedPart = Object.assign({}, VALID_PARTS[i]);
                updatedPart.description = 'Updated description';

                request.put({url:url+"/"+partID[i], form: updatedPart }, function(error, response, body){
                    let responseObj = JSON.parse(body);
                    expect(responseObj.statusCode).to.equal(200);
                    expect(responseObj.data.description).to.equal(updatedPart.description);
                    done();
                });
            });       
        }
    });

    describe('DELETE Part', function(){
        
        for (let i=0; i < VALID_PARTS.length; i++) { 
            
            it('DELETE '+ VALID_PARTS[i].partName +' (204)', function(done){
                request.delete({url:url+"/"+partID[i],form:VALID_PARTS[0]}, function(error, response, body){
                    let responseObj = JSON.parse(body);
                    expect(responseObj.statusCode).to.equal(204);
                    done();
                });
            });
        }
        it('DELETE Non-existent object (500)', function(done){
            request.delete({url:url+"/"+"12345",form:VALID_PARTS[0]}, function(error, response, body){
                let responseObj = JSON.parse(body);
                expect(responseObj.statusCode).to.equal(500);
                done();
            });
        });

    });

});