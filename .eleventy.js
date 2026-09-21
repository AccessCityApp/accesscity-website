const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    const markdown = markdownIt({
        html: true,
        breaks: false,
        linkify: true,
    });

    eleventyConfig.addPassthroughCopy({ "assets": "assets" });

    // Cached HTML still points at the pre-v2 filenames; serve the current
    // files there too until those cache entries expire.
    eleventyConfig.addPassthroughCopy({ "assets/styles.v2.css": "assets/styles.css" });
    eleventyConfig.addPassthroughCopy({ "assets/app.v2.js": "assets/app.js" });
    eleventyConfig.addPassthroughCopy({ "assets/logo.v2.png": "assets/logo.png" });
    eleventyConfig.addPassthroughCopy({ "index.html": "index.html" });
    eleventyConfig.addPassthroughCopy({ "media": "media" });
    eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
    eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
    eleventyConfig.addFilter("markdown", (value) => markdown.render(value || ""));

    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "dist"
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk"
    };
};