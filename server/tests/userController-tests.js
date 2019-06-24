const assert = require("assert");
const expect = require('chai').expect;
const sinon = require("sinon");
let user = require('./../api/users/user');
//let userModel = new User(user);
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
const USER_TO_UPDATE = {};
const USER_EMAIL = "user@mail.com";
const USER_TO_SAVE = {};

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

  it("Success call should return user object.", async () => {
    // Set up
    findById = sinon.stub(user, 'findById').returns({
      exec: sinon.stub().resolves(USER_OBJECT_MOCK)
    });

    try {
      // Do test
      let result = await userController.findById(USER_ID);

      // Assertions
      expect(result).to.deep.equal(USER_OBJECT_MOCK);

    } catch (error) {
      console.error('responseError ' + error);
      assert.ok(false, "should not thrown an error.");
    }

  });

  it("Error during find should return error.", async () => {
    // Set up
    const error = new Error();
    findById = sinon.stub(user, 'findById').returns({
      exec: sinon.stub().rejects(error)
      // exec: sinon.stub().resolves(USER_OBJECT_MOCK)
    });

    try {

      await userController.findById(USER_ID);
      assert.ok(false, "should thrown an error.");

    } catch (responseError) {
      sinon.assert.match(responseError, error);
    }
  });

  afterEach(() => {
    findById.restore();
  });

  describe("Finding user by email.", function () {

    let findOne;

    it("Should invoke find user one.", function () {
      // Set up
      findOne = sinon.spy(user, "findOne");

      // Do test
      userController.findOne(USER_EMAIL);

      // Assertions
      sinon.assert.calledOnce(findOne);
    });

    it("Should invoke find one user with user email.", function () {
      // Set up
      findOne = sinon.spy(user, "findOne");

      // Do test
      userController.findOne(USER_EMAIL);

      // Assertions
      assert(findOne.calledWith({ email: USER_EMAIL }));
    });

    it("Success call should return user object.", async () => {
      // Set up
      findOne = sinon.stub(user, 'findOne').resolves(USER_OBJECT_MOCK);

      try {
        let result = await userController.findOne(USER_EMAIL);

        // Assertions
        expect(result).to.deep.equal(USER_OBJECT_MOCK);

      } catch (responseError) {
        console.error('responseError ' + responseError);
        assert.ok(false, "should not thrown an error.");
      }
    });

    it("Error during find should return error.", async () => {
      // Set up
      const error = new Error();
      findOne = sinon.stub(user, 'findOne').rejects(error);

      try {

        await userController.findOne(USER_EMAIL);
        assert.ok(false, "should thrown an error.");

      } catch (responseError) {
        sinon.assert.match(responseError, error);
      }
    });

    afterEach(() => {
      findOne.restore();
    });

  });

  describe("Save user.", function () {

    let save;

    it("Should invoke save user.", function () {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      // Do test
      userController.save(USER_TO_SAVE);

      // Assertions
      sinon.assert.calledOnce(save);
    });


    it("Should invoke save user with user.", function () {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      // Do test
      userController.save(USER_TO_SAVE);

      // Assertions
      assert(save.calledWith(USER_TO_SAVE));

    });

    it("Success call should return created user.", async () => {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      try {
        let result = await userController.save(USER_TO_SAVE);
        expect(result).to.deep.equal(USER_OBJECT_MOCK);
      } catch (responseError) {
        console.error('responseError ' + responseError);
        assert.ok(false, "should not thrown an error.");
      }
    });

    it("Error calling save should return error.", async () => {
      // Set up
      const error = new Error();
      save = sinon.stub(user, 'create').rejects(error);

      try {

        await userController.save(USER_TO_SAVE);
        assert.ok(false, "should thrown an error.");

      } catch (responseError) {
        sinon.assert.match(responseError, error);
      }
    });

    afterEach(() => {
      save.restore();
    });

  });


  /*

describe("Update user.", function () {

    let findOneAndUpdate;

    it("Should finvoke ind one and update.", function () {
        // Set up
        findOneAndUpdate = sinon.spy(user, "findOneAndUpdate");

        // Do test
        userController.update(USER_ID, USER_TO_UPDATE);

        // Assertions
        sinon.assert.calledOnce(findOneAndUpdate);
    });

    it("Should invoke find one and update user with user id.", function () {
        // Set up
        findOneAndUpdate = sinon.spy(user, "findOneAndUpdate");

        // Do test
        userController.update(USER_ID, USER_TO_UPDATE);

        // Assertions
        assert(findOneAndUpdate.calledWith({_id:USER_ID},
            {$set: USER_TO_UPDATE}, {new:true}));

    });

    it("Success call should return updated user.", function (done) {
        // Set up
        findOneAndUpdate = sinon.stub(user, 'findOneAndUpdate').resolves(USER_OBJECT_MOCK);

        // Do test
        userController.update(USER_ID, USER_TO_UPDATE).then(data => {

            // Assertions
            expect(data).to.deep.equal(USER_OBJECT_MOCK);

        }).catch(responseError => {
            console.error('responseError ' + responseError);
            assert.ok(false, "should not thrown an error.");

        }).then(() => done(), error => done(error));
    });

    it("Error calling update should return error.", function (done) {
      // Set up
      const error = new Error();
      findOneAndUpdate = sinon.stub(user, 'findOneAndUpdate').rejects(error);

      // Do test
      userController.update(USER_ID, USER_TO_UPDATE).then(data => {
          assert.ok(false, "should thrown an error.");

      }).catch(responseError => {
        // Assertions
        sinon.assert.match(responseError, error);

      }).then(() => done(), error => done(error));
  });

    afterEach(() => {
        findOneAndUpdate.restore();
    });

});

describe("Save user.", function () {

  let save;

  it("Should invoke save user.", function () {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      // Do test
      userController.save(USER_TO_SAVE);

      // Assertions
      sinon.assert.calledOnce(save);
  });

  it("Should invoke save user with user.", function () {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      // Do test
      userController.save(USER_TO_SAVE);

      // Assertions
      assert(save.calledWith(USER_TO_SAVE));

  });

  it("Success call should return created user.", function (done) {
      // Set up
      save = sinon.stub(user, 'create').resolves(USER_OBJECT_MOCK);

      // Do test
      userController.save(USER_TO_SAVE).then(data => {

          // Assertions
          expect(data).to.deep.equal(USER_OBJECT_MOCK);

      }).catch(responseError => {
          console.error('responseError ' + responseError);
          assert.ok(false, "should not thrown an error.");

      }).then(() => done(), error => done(error));
  });

  it("Error calling save should return error.", function (done) {
    // Set up
    const error = new Error();
    save = sinon.stub(user, 'create').rejects(error);

    // Do test
    userController.save(USER_TO_SAVE).then(data => {
        assert.ok(false, "should thrown an error.");

    }).catch(responseError => {
      // Assertions
      sinon.assert.match(responseError, error);

    }).then(() => done(), error => done(error));
});

  afterEach(() => {
    save.restore();
  });

*/
});
