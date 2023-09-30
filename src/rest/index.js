import { createServer } from "http";
import MySQLRepository from "../adapter/persistence/mysql.js";
import { log } from "./utils.js";
import { config } from "../config/config.js";
import Service from "../core/impl/service.js";
import Handler from "./handler.js";

const repository = new MySQLRepository();
const service = new Service(repository);
const handler = new Handler(service);

const server = createServer(async (req, res) => {
    if (req.url === "/ping" && req.method === "GET") { handler.ping(res) }
    else if (req.url === "/todos" && req.method === "POST") { handler.create(req, res) }
    else if (req.url.match(/^\/todos\??/) && req.method === "GET") { handler.list(req, res) }
    else if (req.url.match(/\/todos\/[0-9]*$/) && req.method === "GET") { handler.get(req, res) }
    else if (req.url.match(/\/todos\/[0-9]*$/) && req.method === "PUT") { handler.update(req, res) }
    else if (req.url.match(/\/todos\/[0-9]*$/) && req.method === "DELETE") { handler.delete(req, res) }
    else {
        res.writeHead(405);
        res.end()
    }
});

const port = config.app.port || 8000;
server.listen(port, () => {
    console.log(`server is running on port: ${port}`);
});

const timeout = config.app.shutdownTimeout || 10000;
const gracefulShutdown = (signal) => {
    console.log(`${signal} signal received, closing http server`);
    
    server.close((err) => {
        err ? console.log(`failed to close http server: ${err.message}`) : console.log("http server closed");
        repository.close();
        process.exit(0);
    });

    setTimeout(() => {
        console.log(`failed to close http server within ${timeout} ms`);
        process.exit(0);
    }, timeout);
};

process.on("SIGINT", () => {gracefulShutdown("SIGINT")});
process.on("SIGTERM", () => {gracefulShutdown("SIGTERM")})
