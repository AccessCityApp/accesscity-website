const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
    // Bodies are CMS-authored and output with | safe; the visual editor never emits HTML.
    const markdown = markdownIt({
        html: false,
        breaks: false,
        linkify: true,
    });

    eleventyConfig.addPassthroughCopy({ "assets": "assets" });

    // Cached HTML still points at older asset filenames; keep serving them
    // until those cache entries expire. The old script names get app.v3.js,
    // not app.v4.js: those pages still need its in-place language toggle.
    eleventyConfig.addPassthroughCopy({ "assets/styles.v2.css": "assets/styles.css" });
    eleventyConfig.addPassthroughCopy({ "assets/app.v3.js": "assets/app.v2.js" });
    // Passthroughs are keyed by source path, so a second copy needs another spelling.
    eleventyConfig.addPassthroughCopy({ "./assets/app.v3.js": "assets/app.js" });
    eleventyConfig.addPassthroughCopy({ "assets/logo.v2.png": "assets/logo.png" });
    eleventyConfig.addPassthroughCopy({ "media": "media" });
    eleventyConfig.addPassthroughCopy({ "robots.txt": "robots.txt" });
    eleventyConfig.addFilter("markdown", (value) => markdown.render(value || ""));
    // Nunjucks calls globals with its render context as `this`, which holds the page's lang.
    eleventyConfig.addNunjucksGlobal("t", function (el, en) {
        return this.ctx.lang === "en" ? en : el;
    });

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