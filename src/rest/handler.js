import { log, readAll } from "./utils.js";

class Handler {
    constructor(service) {
        this.service = service;
    }

    async ping(res) {
        log("INFO", "ping", req);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "ok" }));
    }

    async create(req, res) {
        log("INFO", "create", req);
        const data = await readAll(req);
        const { name } = JSON.parse(data);
       
        this.service.create(name).
            then(() => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: null }));
                return;
            }).
            catch(err => {
                log("ERROR", "create", req, err.message);

                if (err.message === "todo is already exist") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }

                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            });
    }

    async list(req, res) {
        log("INFO", "list", req);
        const filter = Object.fromEntries(new URLSearchParams(req.url.split("?")[1]));
        
        this.service.list(filter).
            then((result) => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ data: result }));
                return;
            }).
            catch(err => {
                log("ERROR", "list", req, err.message);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            });
    }

    async get(req, res) {
        log("INFO", "get", req);
        const idString = req.url.split("/")[2];
        const id = parseInt(idString, 10);

        this.service.get(id).
            then((result) => {
                if (result.length > 0) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ data: result[0] }));
                    return;
                }
                
                let err = new Error("todo is not found");
                log("ERROR", "get", req, err.message);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }).
            catch(err => {
                log("ERROR", "get", req, err.message);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            });
    }

    async update(req, res) {
        log("INFO", "update", req);
        const idString = req.url.split("/")[2];
        const id = parseInt(idString, 10);

        const data = await readAll(req);
        const todo = JSON.parse(data);
        todo.id = id

        this.service.update(todo).
            then(() => {
                res.writeHead(204, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: null }));
                return;
            }).
            catch(err => {
                log("ERROR", "update", req, err.message);

                if (err.message === "todo does not exist") {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }

                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            });
    }

    async delete(req, res) {
        log("INFO", "delete", req);
        const idString = req.url.split("/")[2];
        const id = parseInt(idString, 10);

        this.service.delete(id).
            then(() => {
                res.writeHead(204, { "Content-Type": "application/json" });
                res.end();
                return;
            }).
            catch(err => {
                log("ERROR", "delete", req, err.message);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            });
    }
}

export default Handler;