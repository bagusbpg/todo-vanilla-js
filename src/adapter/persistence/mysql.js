import { config } from "../../config/config.js";
import AbstractRepository from "../../core/port/repository.js";
import { createPool } from "mysql2";

class MySQLRepository extends AbstractRepository {
    constructor() {
        super();

        const pool = createPool({...config.db});

        this.pool = pool;
    }

    async create(name) {
        const query = "INSERT INTO todos (name) VALUES (?)";

        return new Promise((resolve, reject) => {
            this.pool.execute(
                query,
                [name],
                (err, _0, _1) => {
                    err ? reject(err) : resolve()
                }
            );  
        })
    }

    async list(filter) {
        let query = "SELECT id, name, is_completed, created_at, updated_at FROM todos WHERE deleted_at IS NULL";
        let args = [];
        
        if (filter?.name) {
            query = query + " AND name = ?";
            args.push(filter.name);
        }

        if (filter?.is_completed) {
            query = query + " AND is_completed = ?";
            args.push(filter.is_completed === "true" ? 1 : 0);
        }

        let limit = filter?.limit || 5;
        query = query + " LIMIT ?";
        args.push(limit);

        let offset = filter?.offset || 0;
        query = query + " OFFSET ?";
        args.push(offset);
        
        return new Promise((resolve, reject) => {
            this.pool.query(
                query,
                args,
                (err, result, _) => {
                    err ? reject(err) : resolve(result.map((todo) => ({...todo, is_completed: todo.is_completed === 1})));
                }
            );  
        })
    }

    async get(id) {
        const query = "SELECT id, name, is_completed, created_at, updated_at FROM todos WHERE id = ? AND deleted_at IS NULL";

        return new Promise((resolve, reject) => {
            this.pool.query(
                query,
                id,
                (err, result, _) => {
                    err ? reject(err) : resolve(result.map((todo) => ({...todo, is_completed: todo.is_completed === 1})));
                }
            );  
        })
    }

    async update(todo) {
        let query = "UPDATE todos SET";
        let args = [];

        if (todo?.name.length > 0) {
            query = query + " name = ?";
            args.push(todo.name);
        }

        if (todo?.is_completed != undefined) {
            query = args.length > 0 ? query + "," : query;
            query = query + " is_completed = ?";
            args.push(todo.is_completed ? 1 : 0);
        }

        query = query + " WHERE id = ? AND deleted_at IS NULL";
        args.push(todo.id);

        return new Promise((resolve, reject) => {
            this.pool.execute(
                query,
                [...args],
                (err, _0, _1) => {
                    err ? reject(err) : resolve()
                }
            );
        })
    }

    async delete(id) {
        const query = "UPDATE todos SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL";

        return new Promise((resolve, reject) => {
            this.pool.execute(
                query,
                [id],
                (err, _0, _1) => {
                    err ? reject(err) : resolve();
                }
            );  
        })
    }

    close() {
        this.pool.end((err) => {
            err ? console.log(`failed to close database pool: ${err.message}`) : console.log("database pool closed");
        });
    }
}

export default MySQLRepository;