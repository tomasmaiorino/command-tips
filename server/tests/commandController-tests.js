const assert = require("assert");
const expect = require('chai').expect;
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
const TAG_TO_SEARCH = 'NODE';

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


    it("Should invoke find command with command id.", function () {
        // Set up
        findById = sinon.spy(command, "findById");

        // Do test
        commandController.findById(COMMAND_ID);

        // Assertions
        assert(findById.calledWith(COMMAND_ID));
    });


    it("Success call should return command object.", function (done) {
        // Set up
        findById = sinon.stub(command, 'findById').returns({
            exec: sinon.stub().resolves(COMMAND_OBJECT_MOCK)
        });

        // Do test
        commandController.findById(COMMAND_ID).then(data => {

            // Assertions
            expect(data).to.deep.equal(COMMAND_OBJECT_MOCK);

        }).catch(responseError => {
            console.log("error " + responseError);
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

describe("Finding command by tag.", function () {

    let findByTag;

    it("Should invoke find command with tag.", function () {
        // Set up
        findByTag = sinon.spy(command, "find");

        // Do test
        commandController.findByTag(TAG_TO_SEARCH);

        // Assertions
        sinon.assert.calledWith(findByTag, { "tags": { $regex: TAG_TO_SEARCH, $options: 'i' } });
    });


    it("Should invoke find command by tag.", function () {
        // Set up
        findByTag = sinon.spy(command, "find");

        // Do test
        commandController.findByTag(TAG_TO_SEARCH);

        // Assertions
        sinon.assert.calledOnce(findByTag);
    });

    it("Success call should return command object.", function (done) {
        // Set up
        findByTag = sinon.stub(command, 'find').returns({
            exec: sinon.stub().resolves(COMMAND_OBJECT_MOCK)
        });

        // Do test
        commandController.findByTag(TAG_TO_SEARCH).then(data => {

            // Assertions
            expect(data).to.deep.equal(COMMAND_OBJECT_MOCK);

        }).catch(responseError => {

            assert.ok(false, "should not thrown an error.");

        }).then(() => done(), error => done(error));
    });

    it("Error during find should return error.", function (done) {
        // Set up
        const error = new Error();
        findByTag = sinon.stub(command, 'find').returns({
            exec: sinon.stub().rejects(error)
        });

        // Do test
        commandController.findByTag(TAG_TO_SEARCH).then(data => {
            assert.ok(false, "should thrown an error.");

        }).catch(responseError => {
            // Assertions
            sinon.assert.match(responseError, error);
        }).then(() => done(), error => done(error));
    });

    afterEach(() => {
        findByTag.restore();
    });

});

describe("Search command.", function () {

    let search;

    it("Should invoke find command with search param.", function () {
        // Set up
        const query = 'task';
        search = sinon.stub(command, 'find').returns({
            exec: sinon.stub().resolves(COMMAND_OBJECT_MOCK)
        });

        // Do test
        commandController.search(query);

        // Assertions
        sinon.assert.calledWith(search, {
            $or: [
                { "full_description": { $regex: query, $options: 'i' } },
                { "title": { $regex: query, $options: 'i' }},
                { "command": { $regex: query, $options: 'i' }}
            ]
        });
    });

    it("Success call should return command object list.", function (done) {
        // Set up
        const query = 'task';
        search = sinon.stub(command, 'find').returns({
            exec: sinon.stub().resolves([COMMAND_OBJECT_MOCK])
        });

        // Do test
        commandController.search(query).then(data => {
            // Assertions
            sinon.match.array.contains([COMMAND_OBJECT_MOCK]);

        }).catch(responseError => {
            console.log('error ' + responseError);
            assert.ok(false, "should not thrown an error.");

        }).then(() => done(), error => done(error));
    });

    it("Error calling search command should return error.", function (done) {
        // Set up
        const query = 'task';
        const error = new Error();
        search = sinon.stub(command, 'find').returns({
            exec: sinon.stub().rejects(error)
        });

       // Do test
       commandController.search(query).then(data => {
            assert.ok(false, "should thrown an error.");

        }).catch(responseError => {
            // Assertions
            sinon.assert.match(responseError, error);
        }).then(() => done(), error => done(error));
    });

    afterEach(() => {
        search.restore();
    });
});
