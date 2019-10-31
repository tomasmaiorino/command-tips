const ErrorsUtils = require('../../util/errorsUtils')
const Tag = require('./tag');

async function save(tag) {
  return Tag.create(tag);
}

async function findAllTags(req, res, next) {

  try {

    let tags = await Tag.find();

    if (tags == null || tags.length == 0) {
      return next(ErrorsUtils.createNotFound('tags not found.'));
    } else {
      return res.status(200).json({
          tags
        });
    }
  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
}



module.exports = { save, findAllTags };
