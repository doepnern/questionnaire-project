const { deleteTagById } = require("./deleteTag");
const { findTag } = require("./findTag");
const { createTag } = require("./createTag");

module.exports = {
  deleteTagById: deleteTagById,
  findTag: findTag,
  createTag: createTag,
};
