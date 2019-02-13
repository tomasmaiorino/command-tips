const assert = require("assert");
const sinon = require("sinon");
let command = require('./../api/commands/command');
let commandController = require('./../api/commands/commandController');
const COMMAND_ID = '5c4f853e8f91855d711176f6';
const COMMAND_OBJECT_MOCK = {
    '_id': '5c4f853e8f91855d711176f6',
    'helpfull': 0, 'unhelpfull': 0, 'works': 0,
    'doesnt_work': 0, 'comments_counts': 0,
    'active': true,
    'title': 'Remove all docker images without tags.',
    'command': '',
    'full_description': 'Remove all docker images without tags.',
    'helpfull_links': '', 'user_id': '5c3f1d1b1fe49b35a0c7a968',
    'tags': 'DOCKER', 'updatedAt': '', 'createdAt': '', '__v': 0
}


describe("Finding command by id.", function () {

    let findById;

    it("Should invoke find command by id.", function () {
        // Set up
        findById = sinon.spy(command, "findById");

        // Do test
        commandController.findById(COMMAND_ID);

        // Assertions
        sinon.assert.calledOnce(findById);
    });

    it("Success call should return command object.", function (done) {
        // Set up
        findById = sinon.stub(command, 'findById').returns({
            exec: sinon.stub().resolves(COMMAND_OBJECT_MOCK)            
        });

        // Do test
        commandController.findById(COMMAND_ID).then(data => {

            // Assertions
            sinon.assert.match(data, COMMAND_OBJECT_MOCK);

        }).catch(responseError => {

            assert.ok(false, "should not thrown an error.");

        }).then(() => done(), error => done(error));
    });

    it("Error during find should return error.", function (done) {
        // Set up
        const error = new Error();
        findById = sinon.stub(command, 'findById').returns({
            exec: sinon.stub().rejects(error)
            // exec: sinon.stub().resolves(COMMAND_OBJECT_MOCK)
        });

        // Do test
        commandController.findById(COMMAND_ID).then(data => {
            assert.ok(false, "should thrown an error.");
        }).catch(responseError => {
            // Assertions
            sinon.assert.match(responseError, error);
        }).then(() => done(), error => done(error));
    });

    afterEach(() => {
        findById.restore();
    });

});