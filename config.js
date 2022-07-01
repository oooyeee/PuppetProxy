import path from "path"
import { fileURLToPath } from "url"
import minimist from "minimist"
import dotenv from "dotenv"

let env = {}
let config = {}

config.port = 9999;

config.__projdir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
config.__distdir = path.join(config.__projdir, "/wwwroot")
config.__iconsdir = path.join(config.__projdir, "/AssetsSource/icons")
config.__publicdir = path.join(config.__projdir, "/ClientSource/public")
config.__srcdir = path.join(config.__projdir, "/ClientSource/src");
config.__datadir = path.join(config.__projdir, "/data")


const known_cli_options = {
    string: "env",
    default: { env: process.env.NODE_ENV || "production" }
}

const cmd_args = minimist(process.argv.slice(2), known_cli_options)

config.isDev = cmd_args["env"] === "development";
// config.isProd = cmd_args["env"] === "production";
config.isProd = !config.isDev;

let dotenvConfig;
if (config.isProd) {
    dotenvConfig = dotenv.config({ path: path.join(config.__projdir, "/.env.production") });
} else {
    dotenvConfig = dotenv.config({ path: path.join(config.__projdir, "/.env.development") })
}
if (dotenvConfig.parsed) {
    env = { ...env, ...dotenvConfig.parsed }
}


export {
    env,
    config
}