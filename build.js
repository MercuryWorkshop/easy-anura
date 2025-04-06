const fs = require("fs/promises");
const extract = require('extract-zip');

async function setup() {
    try {
        await fs.access("static/")
        console.log("Anura already installed")
    } catch(e) {
        console.log("Anura static not installed, downloading")
        await fs.writeFile("static.zip", Buffer.from(await (await (fetch("https://github.com/MercuryWorkshop/anuraOS/releases/download/latest/anura.zip"))).arrayBuffer())); // Insanity
        
        await fs.mkdir("static");
        const config = JSON.parse(await fs.readFile(__dirname + "static/config.json", "utf-8"));
        // config chanegs
        config.defaultsettings["wisp-url"] = "wss://anura.pro/"; // Wisp server in lieu of vercel supporting one
        fs.writeFile(__dirname + "static/config.json", JSON.stringify(config));

        console.log("Extracting to " + __dirname + "/static")
        
        await extract("static.zip", { dir: __dirname + "/static" });
    }
}
setup();