const fs = require("node:fs");
const path = require("node:path");

const postsDirectory = path.join(process.cwd(), "content", "blog");
const categoryLabels = {
    announcement: {
        el: "Ανακοίνωση",
        en: "Announcement",
    },
    partnerships: {
        el: "Συνεργασίες",
        en: "Partnerships",
    },
    updates: {
        el: "Ενημερώσεις",
        en: "Updates",
    },
    events: {
        el: "Εκδηλώσεις",
        en: "Events",
    },
};

const requiredPostFields = [
    ["slug"],
    ["status"],
    ["publishDate"],
];

function getValueAtPath(entry, fieldPath) {
    return fieldPath.reduce((currentValue, segment) => {
        if (currentValue == null || typeof currentValue !== "object") {
            return undefined;
        }

        return currentValue[segment];
    }, entry);
}

function readRequiredString(entry, fieldPaths, filename, label, trimValue = true) {
    for (const fieldPath of fieldPaths) {
        const value = getValueAtPath(entry, fieldPath);

        if (typeof value === "string" && value.trim() !== "") {
            return trimValue ? value.trim() : value;
        }
    }

    throw new Error(`Missing required field \"${label}\" in ${filename}`);
}

function readOptionalString(entry, fieldPaths, trimValue = true) {
    for (const fieldPath of fieldPaths) {
        const value = getValueAtPath(entry, fieldPath);

        if (typeof value === "string" && value.trim() !== "") {
            return trimValue ? value.trim() : value;
        }
    }

    return "";
}

function formatDateLabel(dateString, locale) {
    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
    }).format(parsedDate);
}

module.exports = function () {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const seenSlugs = new Set();

    return fs
        .readdirSync(postsDirectory)
        .filter((filename) => filename.endsWith(".json"))
        .map((filename) => {
            const filePath = path.join(postsDirectory, filename);
            const entry = JSON.parse(fs.readFileSync(filePath, "utf8"));

            for (const fieldPath of requiredPostFields) {
                readRequiredString(entry, [fieldPath], filename, fieldPath.join("."));
            }

            const slug = readRequiredString(entry, [["slug"]], filename, "slug");

            if (seenSlugs.has(slug)) {
                throw new Error(`Duplicate blog slug \"${slug}\" in ${filename}`);
            }

            seenSlugs.add(slug);

            const publishDate = readRequiredString(entry, [["publishDate"]], filename, "publishDate");
            const titleEl = readRequiredString(entry, [["greek", "title"], ["titleEl"]], filename, "greek.title");
            const titleEn = readRequiredString(entry, [["english", "title"], ["titleEn"]], filename, "english.title");
            const excerptEl = readRequiredString(entry, [["greek", "excerpt"], ["excerptEl"]], filename, "greek.excerpt");
            const excerptEn = readRequiredString(entry, [["english", "excerpt"], ["excerptEn"]], filename, "english.excerpt");

            const categoryKey = readOptionalString(entry, [["categoryKey"]]).toLowerCase();
            const categoryFromKey = categoryLabels[categoryKey];

            return {
                slug,
                status: readRequiredString(entry, [["status"]], filename, "status").toLowerCase(),
                publishDate,
                dateLabelEl: readOptionalString(entry, [["greek", "dateLabel"], ["dateLabelEl"]]) || formatDateLabel(publishDate, "el-GR"),
                dateLabelEn: readOptionalString(entry, [["english", "dateLabel"], ["dateLabelEn"]]) || formatDateLabel(publishDate, "en-US"),
                categoryEl: categoryFromKey?.el || readRequiredString(entry, [["greek", "category"], ["categoryEl"]], filename, "greek.category"),
                categoryEn: categoryFromKey?.en || readRequiredString(entry, [["english", "category"], ["categoryEn"]], filename, "english.category"),
                titleEl,
                titleEn,
                excerptEl,
                excerptEn,
                seoTitleEl: readOptionalString(entry, [["greek", "seoTitle"], ["seoTitleEl"]]) || `${titleEl} - Accessity`,
                seoTitleEn: readOptionalString(entry, [["english", "seoTitle"], ["seoTitleEn"]]) || `${titleEn} - Accessity`,
                seoDescriptionEl: readOptionalString(entry, [["greek", "seoDescription"], ["seoDescriptionEl"]]) || excerptEl,
                seoDescriptionEn: readOptionalString(entry, [["english", "seoDescription"], ["seoDescriptionEn"]]) || excerptEn,
                bodyEl: readRequiredString(entry, [["greek", "body"], ["bodyEl"]], filename, "greek.body", false),
                bodyEn: readRequiredString(entry, [["english", "body"], ["bodyEn"]], filename, "english.body", false),
                tagStyle: ((entry.tagStyle || "default") + "").trim(),
                cardTheme: ((entry.cardTheme || "default") + "").trim(),
            };
        })
        .sort((left, right) => {
            return new Date(right.publishDate) - new Date(left.publishDate);
        });
};