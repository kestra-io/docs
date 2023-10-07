import fs from "fs";

const vercelPath = ".vercel/output/functions/__nitro.func/index.mjs";

if (fs.existsSync(vercelPath)) {
    // fs.appendFileSync(vercelPath, '\n\nimport \'remark-code-import\';\nimport \'remark-flexible-markers\';\n', 'utf8');
    // console.log("[build-hack.js] missing remark plugin added!");
}
