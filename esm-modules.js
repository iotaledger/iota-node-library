const fs = require("fs").promises;
const path = require("path");

async function run(rootDir) {
    console.log("Root Directory", path.resolve(rootDir));
    await processDir("./dist/esm");
}

async function processDir(dir) {
    const entries = await fs.readdir(dir);

    for (const entry of entries) {
        const fullEntry = path.join(dir, entry);
        const stat = await fs.stat(fullEntry);

        if (stat.isFile()) {
            console.log("Processing File", fullEntry);

            let content = await fs.readFile(fullEntry, "utf-8");
            if (!content.includes(".mjs")) {
                content = content.replace(/import(.*)\"\.(.*)\";/g, "import$1\"\.$2.mjs\";");
                content = content.replace(/export(.*)\"\.(.*)\";/g, "export$1\"\.$2.mjs\";");
                await fs.writeFile(fullEntry, content, "utf-8");
            }

            if (/\.js$/.test(fullEntry)) {
                const newName = fullEntry.replace(/\.js$/, ".mjs");
                await fs.rename(fullEntry, newName);
            }

        } else if (stat.isDirectory()) {
            console.log("Processing Dir", fullEntry);
            await processDir(fullEntry);
        }
    }
}

console.error("ESM Modules");

if (process.argv.length < 3) {
    console.error("Error: Not enough commane line arguments.");
    process.exit(1);
}

run(process.argv[2])
    .then(() => console.log("Done"))
    .catch((e) => console.error(e));
