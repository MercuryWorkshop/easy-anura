const http = require("node:http");
const wisp = require("wisp-server-node");
const express = require("express");
const fs = require('fs/promises');
const extract = require('extract-zip');
const ANURA_DIST = "https://nightly.link/MercuryWorkshop/anuraOS/workflows/build.yaml/main/Anura%20static%20build.zip"

function startServer() {
    const app = express()

    // Cors isolation
    app.use((req, res, next) => {
        res.header("Cross-Origin-Embedder-Policy", "require-corp");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Cross-Origin-Opener-Policy", "same-origin");
        res.header("Cross-Origin-Resource-Policy", "same-site");
        next();
    })

    app.use(express.static("static"))
    httpServer = app.listen((process.env.PORT || 8000))
    // no wsproxy support until I add it to wisp-server-node, why? Because, I dont feel like it
    httpServer.on('upgrade', (req, socket, head) => {
        wisp.routeRequest(req, socket, head);
    })

    console.log("Started on port " + (process.env.PORT || 8000))
}


async function setup() {
    try {
        await fs.access("static/")
        console.log("Anura already installed")
        startServer();
    } catch(e) {
        console.log("Anura static not installed, downloading")
        await fs.writeFile("static.zip", Buffer.from(await (await (fetch(ANURA_DIST))).arrayBuffer())) // Insanity
        console.log("Extracting to " + __dirname + "/")
        
        await extract("static.zip", { dir: __dirname + "/" });
        await extract("anura.zip", { dir: __dirname + "/" });
        startServer();
    }
}
setup()