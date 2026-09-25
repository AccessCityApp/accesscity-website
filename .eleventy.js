const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Bodies are CMS-authored and output with | safe; the visual editor never emits HTML.
    const markdown = markdownIt({
        html: false,
        breaks: false,
        linkify: true,
    });

    eleventyConfig.addPassthroughCopy({ "assets": "assets" });

    // Cached HTML still points at older asset filenames; serve the current
    // files there too until those cache entries expire.
    eleventyConfig.addPassthroughCopy({ "assets/styles.v2.css": "assets/styles.css" });
    eleventyConfig.addPassthroughCopy({ "assets/app.v3.js": "assets/app.v2.js" });
    // Passthroughs are keyed by source path, so a second copy needs another spelling.
    eleventyConfig.addPassthroughCopy({ "./assets/app.v3.js": "assets/app.js" });
    eleventyConfig.addPassthroughCopy({ "assets/logo.v2.png": "assets/logo.png" });
    eleventyConfig.addPassthroughCopy({ "media": "media" });
    eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
    // Output is inlined in a <script>, which a literal "</script>" would close.
    eleventyConfig.addFilter("json", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));
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