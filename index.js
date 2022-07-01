import path from "path"
import fs from "fs"
import { config, env } from "./config.js"

import { server } from "./Server/wss.js"

import { InitDB } from "./lib/db.js"

InitDB(true);

server.listen(config.port, () => {
    console.log(`== Server listening on port: ${config.port}`);
})
