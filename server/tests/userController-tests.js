const assert = require("assert");
const expect = require('chai').expect;
const sinon = require("sinon");
let user = require('./../api/users/user');
let userController = require('./../api/users/userController');
const USER_ID = '5c4f853e8f91855d711176f6';
const USER_OBJECT_MOCK = {
    '_id': '5c4f853e8f91855d711176f6',
    'helpfull': 0, 'unhelpfull': 0, 'works': 0,
    'doesnt_work': 0, 'comments_counts': 0,
    'active': true,
    'title': 'Remove all docker images without tags.',
    'user': '',
    'full_description': 'Remove all docker images without tags.',
    'helpfull_links': '', 'user_id': '5c3f1d1b1fe49b35a0c7a968',
    'tags': 'DOCKER', 'updatedAt': '', 'createdAt': '', '__v': 0
}
const TAG_TO_SEARCH = 'NODE';

describe("Finding user by id.", function () {

    let findById;

    it("Should invoke find user by id.", function () {
        // Set up
        findById = sinon.spy(user, "findById");

        // Do test
        userController.findById(USER_ID);

        // Assertions
        sinon.assert.calledOnce(findById);
    });


    it("Should invoke find user with user id.", function () {
        // Set up
        findById = sinon.spy(user, "findById");

        // Do test
        userController.findById(USER_ID);

        // Assertions
        assert(findById.calledWith(USER_ID));
    });
    

    it("Success call should return user object.", function (done) {
        // Set up
        findById = sinon.stub(user, 'findById').returns({
            exec: sinon.stub().resolves(USER_OBJECT_MOCK)
        });

        // Do test
        userController.findById(USER_ID).then(data => {

            // Assertions
            expect(data).to.deep.equal(data);

        }).catch(responseError => {
            console.error('responseError ' + responseError);
            assert.ok(false, "should not thrown an error.");

        }).then(() => done(), error => done(error));
    });

    it("Error during find should return error.", function (done) {
        // Set up
        const error = new Error();
        findById = sinon.stub(user, 'findById').returns({
            exec: sinon.stub().rejects(error)
            // exec: sinon.stub().resolves(USER_OBJECT_MOCK)
        });

        // Do test
        userController.findById(USER_ID).then(data => {
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
