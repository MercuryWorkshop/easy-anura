async function setup() {
    try {
        await fs.access("static/")
        console.log("Anura already installed")
        startServer();
    } catch(e) {
        console.log("Anura static not installed, downloading")
        await fs.writeFile("static.zip", Buffer.from(await (await (fetch("https://nightly.link/MercuryWorkshop/anuraOS/workflows/build.yaml/main/Anura%20static%20build.zip"))).arrayBuffer())) // Insanity
        console.log("Extracting to " + __dirname + "/")
        
        await extract("static.zip", { dir: __dirname + "/" });
        await extract("anura.zip", { dir: __dirname + "/" });
        startServer();
    }
}
await setup();