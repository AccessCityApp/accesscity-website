const loadPosts = require("./posts");

module.exports = function () {
    return loadPosts().filter((post) => post.status === "published");
};