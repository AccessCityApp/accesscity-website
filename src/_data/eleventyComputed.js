// Eleventy first calls these with placeholder data to map dependencies, where
// page.url is empty; clamp so that pass doesn't throw.
const up = (levels) => "../".repeat(Math.max(levels, 0));

// Links stay relative so dist/ also works when opened from disk.
module.exports = {
    // The page's path within its language: "", "blog.html", "blog/<slug>.html".
    urlPath: (data) => data.page.url.replace(/^\/(en\/)?/, ""),
    // From the page to its language's home, for page links.
    homePrefix: (data) => up(data.urlPath.split("/").length - 1),
    // From the page to the site root, for assets and the other language.
    rootPrefix: (data) => up(data.page.url.split("/").length - 2),
};
