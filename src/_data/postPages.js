const loadPublishedPosts = require("./publishedPosts");
const { languages } = require("./site");

// Pagination walks a single list, so pair every post with every language.
module.exports = function () {
    return loadPublishedPosts().flatMap((post) => languages.map((lang) => ({ post, lang })));
};
